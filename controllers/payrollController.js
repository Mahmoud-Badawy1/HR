const Employee = require('../models/employees');
const PayrollSlip = require('../models/PayrollSlip');
const SocialInsuranceConfig = require('../models/SocialInsurance_Config');
const TaxConfig = require('../models/Tax_Config');
const Salfah = require('../models/Salfah');
const Penalty = require('../models/Penalties_Gezaat');

exports.calculateMonthlyPayroll = async (req, res) => {
    try {
        const { employeeId, month, year, bonus = 0, overtime = 0 } = req.body;
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "الموظف غير موجود" });

        // Fetch Configurations
        // Fallback to 2025 hardcoded values if config not found (Design choice for robustness) or error
        const insConfig = await SocialInsuranceConfig.findOne({ effectiveYear: year }) || {
            minInsuranceSalary: 2300, maxInsuranceSalary: 14500, employeeRate: 11, employerRate: 18.75
        };
        const taxBrackets = await TaxConfig.find({ effectiveYear: year }).sort({ bracketMin: 1 });

        // 1. Earnings
        const basic = parseFloat(employee.financials.basicSalary);
        const allowances = parseFloat(employee.financials.allowances || 0);
        const gross = basic + allowances + parseFloat(bonus) + parseFloat(overtime);

        // 2. Social Insurance
        // Ensure insurance salary is clamped between limits
        let insSalaryRaw = parseFloat(employee.financials.insuranceSalary);
        if (insSalaryRaw < insConfig.minInsuranceSalary) insSalaryRaw = insConfig.minInsuranceSalary;
        if (insSalaryRaw > insConfig.maxInsuranceSalary) insSalaryRaw = insConfig.maxInsuranceSalary;
        
        const socialInsuranceEmployee = insSalaryRaw * (insConfig.employeeRate / 100);
        const socialInsuranceEmployer = insSalaryRaw * (insConfig.employerRate / 100);

        // 3. Tax Calculation (Progressive)
        // Annualize -> Deduct Exemption -> Apply Brackets -> Monthly
        const personalExemption = taxBrackets.length > 0 ? taxBrackets[0].personalExemption : 20000;
        const annualGross = gross * 12;
        const annualIns = socialInsuranceEmployee * 12;
        let taxableIncome = annualGross - annualIns - personalExemption;
        if (taxableIncome < 0) taxableIncome = 0;

        let annualTax = 0;
        // Simple Bracket Logic (Assuming sorted)
        // NOTE: This is a simplified version. Full Egyptian logic divides income into slices.
        // For this task, we will apply rate of the slice.
        let remainingIncome = taxableIncome;
        let previousLimit = 0;

        for (const bracket of taxBrackets) {
             let limit = bracket.bracketMax ? bracket.bracketMax : Infinity;
             let sliceWidth = limit - previousLimit;
             
             let taxableInSlice = 0;
             if (remainingIncome > sliceWidth) {
                 taxableInSlice = sliceWidth;
             } else {
                taxableInSlice = remainingIncome;
             }
             
             // First bracket 0-30k is 0%, generally handled by rate=0
             annualTax += taxableInSlice * (bracket.taxRate / 100);
             remainingIncome -= taxableInSlice;
             previousLimit = limit;
             
             if (remainingIncome <= 0) break;
        }
        
        // Fallback if no brackets found (Use flat 10% example)
        if (taxBrackets.length === 0 && taxableIncome > 0) annualTax = taxableIncome * 0.10;

        const monthlyTax = annualTax / 12;

        // 4. Martyrs Fund (0.05% of Gross)
        const martyrsFund = gross * 0.0005;

        // 5. Fetch Deductions (Salfah & Geza)
        // Salfah
        const activeSalfah = await Salfah.findOne({ employeeId, status: 'Active' });
        let salfahDeduction = 0;
        if (activeSalfah) {
            salfahDeduction = activeSalfah.monthlyInstallment;
            // Ensure we don't deduct more than remaining
            if (salfahDeduction > activeSalfah.remainingAmount) {
                salfahDeduction = activeSalfah.remainingAmount;
            }
        }

        // Geza (Penalties in this month)
        // Check Penalties where monthApplicable is in the same month/year
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month
        const penalties = await Penalty.find({ 
            employeeId, 
            monthApplicable: { $gte: startDate, $lte: endDate } 
        });
        
        let gezaAmount = 0;
        penalties.forEach(p => {
            gezaAmount += (basic / 30) * p.daysDeducted;
        });

        // 6. Total Deductions & Cap Logic (50% of Net after Tax/Ins)
        // Article 67: Deductions cannot exceed 50% of wage
        // Interpretation: (Gross - Ins - Tax) * 50%
        const netBeforeDed = gross - socialInsuranceEmployee - monthlyTax - martyrsFund;
        const maxDeductible = netBeforeDed * 0.50;

        let currentDeductible = salfahDeduction + gezaAmount;
        let isCapped = false;
        let finalSalfah = salfahDeduction;
        let finalGeza = gezaAmount;

        if (currentDeductible > maxDeductible) {
            isCapped = true;
            // Priority: Geza first? Or Salfah? Usually Salfah is fixed. Let's reduce Salfah if needed or defer Geza.
            // Requirement says: "Adjust installment if it violates 50% cap" -> Implies Salfah is adjusted.
            
            // Allocate maxDeductible to Geza first (disciplinary), then Salfah? OR proportional?
            // "FR-DM-004: System MUST adjust installment if it violates 50% deduction cap"
            // So we reduce Salfah.
            
            if (gezaAmount > maxDeductible) {
                finalGeza = maxDeductible; // Even Geza is capped? Law generally says total deductions.
                finalSalfah = 0;
            } else {
                finalGeza = gezaAmount;
                finalSalfah = maxDeductible - gezaAmount;
            }
        }

        const totalDeductions = socialInsuranceEmployee + monthlyTax + martyrsFund + finalSalfah + finalGeza; // + otherDeductions
        const netSalary = gross - totalDeductions;

        const slip = await PayrollSlip.create({
            employeeId,
            period: { month, year },
            earnings: { basic, allowances, bonus, overtime, gross },
            deductions: {
                socialInsurance: socialInsuranceEmployee,
                socialInsuranceEmployer: socialInsuranceEmployer,
                incomeTax: monthlyTax,
                martyrsFund,
                salfah: finalSalfah,
                geza: finalGeza,
                totalDeductions
            },
            netSalary,
            isCapped
        });
        
        // If Salfah was deducted, update Remaining Amount logic should be separate step (e.g. when confirming payment).
        // For calculation (Draft), we don't update Salfah balance yet.

        res.status(201).json({ success: true, data: slip });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPayrollSlips = async (req, res) => {
    try {
        const { employeeId, month, year } = req.query;
        const query = {};
        if (employeeId) query.employeeId = employeeId;
        if (month) query['period.month'] = month;
        if (year) query['period.year'] = year;

        const slips = await PayrollSlip.find(query).populate('employeeId', 'fullName');
        res.status(200).json({ success: true, count: slips.length, data: slips });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// دالة عامة يمكنك تطبيقها في كل متحكم مع تغيير الموديل
exports.deletePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        
        const record = await PayrollSlip.findByIdAndDelete(id);
        
        if (!record) {
            return res.status(404).json({ success: false, message: "سجل الراتب هذا غير موجود" });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "تم حذف سجل الراتب بنجاح بواسطة المدير" 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
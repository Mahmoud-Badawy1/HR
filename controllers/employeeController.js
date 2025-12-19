const Employee = require('../models/employees');

exports.addEmployee = async (req, res) => {
    try {
        const { financials } = req.body;
        // Basic clamp logic for insurance salary if not provided (2025 limits)
        if (financials && financials.basicSalary) {
            let basic = parseFloat(financials.basicSalary);
            let insurance = basic;
            if (insurance < 2300) insurance = 2300;
            if (insurance > 14500) insurance = 14500;
            financials.insuranceSalary = insurance;
            req.body.financials = financials;
        }

        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, departmentId, role } = req.query;
        const query = {};
        if (departmentId) query.departmentId = departmentId;
        if (role) query.role = role;

        const employees = await Employee.find(query)
            .populate('departmentId', 'departmentName')
            .populate('positionId', 'positionTitle')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Employee.countDocuments(query);

        res.status(200).json({
            success: true,
            data: employees,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('departmentId')
            .populate('positionId')
            .populate('managerId', 'fullName');
            
        if (!employee) return res.status(404).json({ message: "الموظف غير موجود" });
        
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(404).json({ message: "الموظف غير موجود" });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const updates = req.body;
        
        // Recalculate insurance salary if basic salary changes
        if (updates.financials && updates.financials.basicSalary) {
            let basic = parseFloat(updates.financials.basicSalary);
            let insurance = basic;
            // TODO: Fetch this from SocialInsurance_Config ideally
            if (insurance < 2300) insurance = 2300;
            if (insurance > 14500) insurance = 14500;
            updates.financials.insuranceSalary = insurance;
        }

        const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        
        if (!employee) return res.status(404).json({ message: "الموظف غير موجود" });

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        // التحقق مما إذا كان للموظف سلف نشطة قبل الحذف
        const Salfah = require('../models/Salfah'); // Lazy load to avoid circular dependency issues if any
        const hasActiveSalfah = await Salfah.findOne({ employeeId: req.params.id, status: { $in: ['Active', 'Pending'] } });
        
        if (hasActiveSalfah) return res.status(400).json({ message: "لا يمكن حذف موظف لديه سلفة نشطة أو معلقة" });

        const employee = await Employee.findByIdAndDelete(req.params.id);
        
        if (!employee) return res.status(404).json({ message: "الموظف غير موجود" });

        res.status(200).json({ success: true, message: "تم حذف الموظف وجميع بياناته" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
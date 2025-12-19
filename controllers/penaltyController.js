const Penalty = require('../models/Penalties_Gezaat');
const Employee = require('../models/employees');

exports.addPenalty = async (req, res) => {
    try {
        const { employeeId, daysDeducted, reason, monthApplicable } = req.body;
        
        // Validation
        const employee = await Employee.findById(employeeId);
        if (!employee) return res.status(404).json({ message: "الموظف غير موجود" });
        
        // Month should be start of month
        const monthDate = new Date(monthApplicable);
        
        // Create penalty
        const penalty = await Penalty.create({
            employeeId,
            daysDeducted,
            reason,
            monthApplicable: monthDate,
            approvedBy: req.user ? req.user.id : null // Assuming auth middleware sets req.user
        });
        
        res.status(201).json({ success: true, data: penalty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPenalties = async (req, res) => {
    try {
        const { employeeId, month, year } = req.query;
        const query = {};
        if (employeeId) query.employeeId = employeeId;
        
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            query.monthApplicable = { $gte: startDate, $lte: endDate };
        }

        const penalties = await Penalty.find(query).populate('employeeId', 'fullName');
        res.status(200).json({ success: true, data: penalties });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePenalty = async (req, res) => {
    try {
        await Penalty.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "تم حذف الجزاء" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

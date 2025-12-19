const Department = require('../models/Department');

exports.addDepartment = async (req, res) => {
    try {
        const dept = await Department.create(req.body);
        res.status(201).json({ success: true, data: dept });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const depts = await Department.find().populate('managerId', 'fullName');
        res.status(200).json({ success: true, count: depts.length, data: depts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dept) return res.status(404).json({ message: "القسم غير موجود" });
        res.status(200).json({ success: true, data: dept });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const dept = await Department.findByIdAndDelete(req.params.id);
        if (!dept) return res.status(404).json({ message: "القسم غير موجود" });
        res.status(200).json({ success: true, message: "تم حذف القسم" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

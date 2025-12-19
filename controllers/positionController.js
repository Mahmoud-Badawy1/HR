const Position = require('../models/Position');

exports.addPosition = async (req, res) => {
    try {
        const pos = await Position.create(req.body);
        res.status(201).json({ success: true, data: pos });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPositions = async (req, res) => {
    try {
        const { departmentId } = req.query;
        const query = departmentId ? { departmentId } : {};
        const positions = await Position.find(query).populate('departmentId', 'departmentName');
        res.status(200).json({ success: true, count: positions.length, data: positions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePosition = async (req, res) => {
    try {
        const pos = await Position.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pos) return res.status(404).json({ message: "الوظيفة غير موجودة" });
        res.status(200).json({ success: true, data: pos });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePosition = async (req, res) => {
    try {
        const pos = await Position.findByIdAndDelete(req.params.id);
        if (!pos) return res.status(404).json({ message: "الوظيفة غير موجودة" });
        res.status(200).json({ success: true, message: "تم حذف الوظيفة" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const mongoose = require('mongoose');

const KPIConfigSchema = new mongoose.Schema({
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    kpiName: { type: String, required: true }, // e.g., "Attendance", "Task Completion"
    kpiNameArabic: { type: String },
    weightage: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index to ensure unique KPI per department
KPIConfigSchema.index({ departmentId: 1, kpiName: 1 }, { unique: true });

module.exports = mongoose.model('KPI_Config', KPIConfigSchema);

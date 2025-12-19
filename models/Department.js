const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true },
    departmentNameArabic: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);

const mongoose = require('mongoose');

const PenaltySchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    daysDeducted: { type: Number, required: true, min: 1, max: 5 },
    reason: { type: String, required: true },
    monthApplicable: { type: Date, required: true }, // First day of the month
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('Penalty', PenaltySchema);

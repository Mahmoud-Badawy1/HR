const mongoose = require('mongoose');

const SocialInsuranceConfigSchema = new mongoose.Schema({
    effectiveYear: { type: Number, required: true, unique: true },
    minInsuranceSalary: { type: Number, required: true },
    maxInsuranceSalary: { type: Number, required: true },
    employeeRate: { type: Number, required: true }, // e.g. 11
    employerRate: { type: Number, required: true }  // e.g. 18.75
}, { timestamps: true });

module.exports = mongoose.model('SocialInsurance_Config', SocialInsuranceConfigSchema);

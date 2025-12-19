const mongoose = require('mongoose');

const PayrollSlipSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    period: {
        month: { type: Number, required: true },
        year: { type: Number, required: true }
    },
    earnings: {
        basic: { type: mongoose.Types.Decimal128, required: true },
        allowances: { type: mongoose.Types.Decimal128, default: 0 },
        overtime: { type: mongoose.Types.Decimal128, default: 0 },
        bonus: { type: mongoose.Types.Decimal128, default: 0 },
        gross: { type: mongoose.Types.Decimal128, required: true }
    },
    deductions: {
        socialInsurance: { type: mongoose.Types.Decimal128, required: true }, // Employee Share
        socialInsuranceEmployer: { type: mongoose.Types.Decimal128, required: true }, // Employer Share
        incomeTax: { type: mongoose.Types.Decimal128, required: true },
        martyrsFund: { type: mongoose.Types.Decimal128, required: true },
        salfah: { type: mongoose.Types.Decimal128, default: 0 },
        geza: { type: mongoose.Types.Decimal128, default: 0 },
        otherDeductions: { type: mongoose.Types.Decimal128, default: 0 },
        totalDeductions: { type: mongoose.Types.Decimal128, required: true }
    },
    netSalary: { type: mongoose.Types.Decimal128, required: true },
    isCapped: { type: Boolean, default: false }, // True if 50% cap was triggered
    status: { type: String, enum: ["Draft", "Approved", "Paid"], default: "Draft" }
}, { timestamps: true });

module.exports = mongoose.model('PayrollSlip', PayrollSlipSchema);
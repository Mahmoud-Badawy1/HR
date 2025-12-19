const mongoose = require('mongoose');

const TaxConfigSchema = new mongoose.Schema({
    effectiveYear: { type: Number, required: true },
    bracketMin: { type: Number, required: true },
    bracketMax: { type: Number }, // Null/Undefined means infinity (top bracket)
    taxRate: { type: Number, required: true, min: 0, max: 100 }, // Percentage
    personalExemption: { type: Number, default: 20000 }
}, { timestamps: true });

TaxConfigSchema.index({ effectiveYear: 1, bracketMin: 1 }, { unique: true });

module.exports = mongoose.model('Tax_Config', TaxConfigSchema);

const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    positionTitle: { type: String, required: true },
    positionTitleArabic: { type: String },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
}, { timestamps: true });

module.exports = mongoose.model('Position', PositionSchema);

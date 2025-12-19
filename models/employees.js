const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    fullNameArabic: { type: String },
    nationalId: { type: String, required: true, unique: true }, // Encrypted at App-level
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    role: { 
        type: String, 
        enum: ["Employee", "Manager", "HR", "Finance", "Admin"],
        required: true 
    },
    joiningDate: { type: Date, default: Date.now },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    positionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    financials: {
        basicSalary: { type: mongoose.Types.Decimal128, required: true },
        allowances: { type: mongoose.Types.Decimal128, default: 0 },
        insuranceSalary: { 
            type: mongoose.Types.Decimal128
            // Logic handled in pre-save or controller
        }
    },
    status: { type: String, default: "Active", enum: ['Active', 'Suspended', 'Terminated'] }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
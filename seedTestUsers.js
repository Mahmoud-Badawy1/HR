/**
 * Seed Script - Test Users
 * Run: node seedTestUsers.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/employees');

dotenv.config();

const testUsers = [
    {
        fullName: "Admin User",
        fullNameArabic: "مستخدم مسؤول",
        nationalId: "29012011234567",
        email: "admin@test.com",
        phoneNumber: "01000000001",
        role: "Admin",
        joiningDate: new Date(),
        financials: {
            basicSalary: 15000,
            allowances: 2000
        },
        status: "Active"
    },
    {
        fullName: "HR User",
        fullNameArabic: "مستخدم موارد بشرية",
        nationalId: "29105051234568",
        email: "hr@test.com",
        phoneNumber: "01000000002",
        role: "HR",
        joiningDate: new Date(),
        financials: {
            basicSalary: 12000,
            allowances: 1500
        },
        status: "Active"
    },
    {
        fullName: "Finance User",
        fullNameArabic: "مستخدم مالية",
        nationalId: "28807101234569",
        email: "finance@test.com",
        phoneNumber: "01000000003",
        role: "Finance",
        joiningDate: new Date(),
        financials: {
            basicSalary: 12000,
            allowances: 1500
        },
        status: "Active"
    },
    {
        fullName: "Manager User",
        fullNameArabic: "مستخدم مدير",
        nationalId: "29303151234570",
        email: "manager@test.com",
        phoneNumber: "01000000004",
        role: "Manager",
        joiningDate: new Date(),
        financials: {
            basicSalary: 10000,
            allowances: 1000
        },
        status: "Active"
    },
    {
        fullName: "Employee User",
        fullNameArabic: "مستخدم موظف",
        nationalId: "29606201234571",
        email: "employee@test.com",
        phoneNumber: "01000000005",
        role: "Employee",
        joiningDate: new Date(),
        financials: {
            basicSalary: 6000,
            allowances: 500
        },
        status: "Active"
    }
];

async function seedUsers() {
    try {
        await mongoose.connect("mongodb+srv://mahmoud:mahmoud@cluster0.un0swjn.mongodb.net/?appName=Cluster0");
        console.log('✅ Connected to MongoDB');

        for (const user of testUsers) {
            const exists = await Employee.findOne({ nationalId: user.nationalId });
            if (exists) {
                console.log(`⏭️  User with nationalId ${user.nationalId} already exists, skipping...`);
            } else {
                await Employee.create(user);
                console.log(`✅ Created user: ${user.fullName} (${user.role})`);
            }
        }

        console.log('\n🎉 Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedUsers();

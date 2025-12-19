const Employee = require('../models/employees');

exports.login = async (req, res) => {
    try {
        const { nationalId } = req.body;

        // Validation
        if (!nationalId) {
            return res.status(400).json({ success: false, message: "National ID is required" });
        }

        // Find user
        const user = await Employee.findOne({ nationalId }).populate('departmentId positionId');

        if (!user) {
            return res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
        }

        if (user.status !== 'Active') {
            return res.status(403).json({ success: false, message: "هذا الحساب غير نشط" });
        }

        // Create a dummy token (since we aren't using JWT setup yet per instructions/middleware)
        // Ideally use jwt.sign here.
        const token = "dummy_token_" + user._id;

        res.status(200).json({
            success: true,
            token: token,
            Employee: user
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

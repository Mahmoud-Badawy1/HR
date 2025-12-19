const TaxConfig = require('../models/Tax_Config');
const KPISConfig = require('../models/KPI_Config');
const InsuranceConfig = require('../models/SocialInsurance_Config');

// --- Tax Config ---
exports.updateTaxConfig = async (req, res) => {
    try {
        const { effectiveYear, bracketMin } = req.body;
        // Upsert based on composite key (Year + Min)
        const config = await TaxConfig.findOneAndUpdate(
            { effectiveYear, bracketMin },
            req.body,
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTaxConfig = async (req, res) => {
    try {
        const { year } = req.query;
        const query = year ? { effectiveYear: year } : {};
        const configs = await TaxConfig.find(query).sort({ bracketMin: 1 });
        res.status(200).json({ success: true, data: configs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- KPI Config ---
exports.addKPI = async (req, res) => {
    try {
        const kpi = await KPISConfig.create(req.body);
        res.status(201).json({ success: true, data: kpi });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getKPIs = async (req, res) => {
    try {
        const { departmentId } = req.query;
        const query = departmentId ? { departmentId } : {};
        const kpis = await KPISConfig.find(query).populate('departmentId', 'departmentName');
        res.status(200).json({ success: true, data: kpis });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Insurance Config ---
exports.updateInsuranceConfig = async (req, res) => {
    try {
        const { effectiveYear } = req.body;
        const config = await InsuranceConfig.findOneAndUpdate(
            { effectiveYear },
            req.body,
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: config });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getInsuranceConfig = async (req, res) => {
    try {
        const { year } = req.query;
        const query = year ? { effectiveYear: year } : {};
        const configs = await InsuranceConfig.find(query);
        res.status(200).json({ success: true, data: configs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

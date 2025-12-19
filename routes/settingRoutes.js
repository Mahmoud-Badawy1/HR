const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const { 
    updateTaxConfig, getTaxConfig, 
    addKPI, getKPIs, 
    updateInsuranceConfig, getInsuranceConfig 
} = require('../controllers/settingController');

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: إعدادات النظام (الضرائب، التأمينات، مؤشرات الأداء)
 */

// --- Tax ---
/**
 * @swagger
 * /api/settings/tax:
 *   post:
 *     summary: تحديث/إضافة شريحة ضريبية (Admin/Finance)
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [effectiveYear, bracketMin, taxRate]
 *             properties:
 *               effectiveYear: { type: number }
 *               bracketMin: { type: number }
 *               bracketMax: { type: number }
 *               taxRate: { type: number }
 *     responses:
 *       200: { description: تم التحديث }
 */
router.post('/tax', authorize(['Admin', 'Finance']), updateTaxConfig);

/**
 * @swagger
 * /api/settings/tax:
 *   get:
 *     summary: عرض الشرائح الضريبية
 *     tags: [Settings]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: السنة (اختياري)
 *     responses:
 *       200:
 *         description: قائمة الشرائح
 */
router.get('/tax', getTaxConfig);

// --- KPI ---
/**
 * @swagger
 * /api/settings/kpi:
 *   post:
 *     summary: إضافة/تحديث مؤشرات الأداء
 *     tags: [Settings]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [departmentId, kpiName, weightage]
 *             properties:
 *               departmentId: { type: string }
 *               kpiName: { type: string }
 *               weightage: { type: number }
 *     responses:
 *       201: { description: تم الإضافة }
 */
router.post('/kpi', authorize(['Admin', 'HR']), addKPI);

/**
 * @swagger
 * /api/settings/kpi:
 *   get:
 *     summary: عرض مؤشرات الأداء
 *     tags: [Settings]
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: قائمة المؤشرات
 */
router.get('/kpi', getKPIs);

// --- Insurance ---
/**
 * @swagger
 * /api/settings/insurance:
 *   post:
 *     summary: تحديث إعدادات التأمينات
 *     tags: [Settings]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [effectiveYear]
 *             properties:
 *               effectiveYear: { type: number }
 *               minInsuranceSalary: { type: number }
 *               maxInsuranceSalary: { type: number }
 *               employeeRate: { type: number }
 *               employerRate: { type: number }
 *     responses:
 *       200: { description: تم التحديث }
 */
router.post('/insurance', authorize(['Admin', 'Finance']), updateInsuranceConfig);

/**
 * @swagger
 * /api/settings/insurance:
 *   get:
 *     summary: عرض إعدادات التأمينات
 *     tags: [Settings]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: الإعدادات
 */
router.get('/insurance', getInsuranceConfig);

module.exports = router;

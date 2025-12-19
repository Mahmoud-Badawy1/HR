const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const { addPenalty, getPenalties, deletePenalty } = require('../controllers/penaltyController');

/**
 * @swagger
 * tags:
 *   name: Penalties
 *   description: إدارة الجزاءات والخصومات
 */

/**
 * @swagger
 * /api/penalties:
 *   post:
 *     summary: إضافة جزاء جديد (Manager/HR)
 *     tags: [Penalties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - daysDeducted
 *               - reason
 *               - monthApplicable
 *             properties:
 *               employeeId:
 *                 type: string
 *               daysDeducted:
 *                 type: number
 *                 description: عدد الأيام (1-5)
 *               reason:
 *                 type: string
 *               monthApplicable:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: تم إضافة الجزاء
 */
router.post('/', authorize(['Admin', 'Manager', 'HR']), addPenalty);

/**
 * @swagger
 * /api/penalties:
 *   get:
 *     summary: عرض الجزاءات
 *     tags: [Penalties]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: قائمة الجزاءات
 */
router.get('/', authorize(['Manager', 'HR', 'Admin']), getPenalties);

/**
 * @swagger
 * /api/penalties/{id}:
 *   delete:
 *     summary: حذف جزاء
 *     tags: [Penalties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم الحذف
 */
router.delete('/:id', authorize(['Admin', 'Manager', 'HR']), deletePenalty);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const { addPosition, getPositions, updatePosition, deletePosition } = require('../controllers/positionController');

/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: إدارة المسميات الوظيفية
 * components:
 *   schemas:
 *     Position:
 *       type: object
 *       required:
 *         - positionTitle
 *         - departmentId
 *       properties:
 *         id:
 *           type: string
 *         positionTitle:
 *           type: string
 *         departmentId:
 *           type: string
 */

/**
 * @swagger
 * /api/positions:
 *   post:
 *     summary: إضافة وظيفة جديدة (Admin/HR)
 *     tags: [Positions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - positionTitle
 *               - departmentId
 *             properties:
 *               positionTitle:
 *                 type: string
 *               departmentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم الإنشاء
 */
router.post('/', authorize(['Admin', 'HR']), addPosition);

/**
 * @swagger
 * /api/positions:
 *   get:
 *     summary: عرض كل الوظائف (أو حسب القسم)
 *     tags: [Positions]
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: تصفية حسب القسم
 *     responses:
 *       200:
 *         description: قائمة الوظائف
 */
router.get('/', getPositions);

/**
 * @swagger
 * /api/positions/{id}:
 *   put:
 *     summary: تحديث بيانات وظيفة
 *     tags: [Positions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Position'
 *     responses:
 *       200:
 *         description: تم التحديث
 */
router.put('/:id', authorize(['Admin', 'HR']), updatePosition);

/**
 * @swagger
 * /api/positions/{id}:
 *   delete:
 *     summary: حذف وظيفة
 *     tags: [Positions]
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
router.delete('/:id', authorize(['Admin']), deletePosition);

module.exports = router;

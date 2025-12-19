const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const { addDepartment, getDepartments, updateDepartment, deleteDepartment } = require('../controllers/departmentController');

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: إدارة الأقسام
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - departmentName
 *       properties:
 *         id:
 *           type: string
 *         departmentName:
 *           type: string
 *         departmentNameArabic:
 *           type: string
 *         managerId:
 *           type: string
 */

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: إضافة قسم جديد (Admin/HR)
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departmentName
 *             properties:
 *               departmentName:
 *                 type: string
 *               departmentNameArabic:
 *                 type: string
 *               managerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم الإنشاء
 */
router.post('/', authorize(['Admin', 'HR', 'Manager']), addDepartment);

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: عرض كل الأقسام
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: قائمة الأقسام
 */
router.get('/', getDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: تحديث بيانات قسم
 *     tags: [Departments]
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
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       200:
 *         description: تم التحديث
 */
router.put('/:id', authorize(['Admin', 'HR', 'Manager']), updateDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: حذف قسم
 *     tags: [Departments]
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
router.delete('/:id', authorize(['Admin']), deleteDepartment);

module.exports = router;

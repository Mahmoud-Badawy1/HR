const express = require('express');
const router = express.Router();
const { addEmployee, getEmployeeProfile, deleteEmployee, getAllEmployees, updateEmployee } = require('../controllers/employeeController');
const { authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: إدارة بيانات الموظفين والرواتب الأساسية
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - fullName
 *         - nationalId
 *         - email
 *         - role
 *         - financials
 *       properties:
 *         fullName:
 *           type: string
 *         fullNameArabic:
 *           type: string
 *         nationalId:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [Employee, Manager, HR, Finance, Admin]
 *         departmentId:
 *           type: string
 *         positionId:
 *           type: string
 *         financials:
 *           type: object
 *           properties:
 *             basicSalary:
 *               type: number
 */


/**
 * @swagger
 * /api/employees/add:
 *   post:
 *     summary: إضافة موظف جديد (HR أو Manager فقط)
 *     tags: [Employees]
 *     parameters:
 *       - in: header
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [HR, Manager]
 *         description: يجب أن تكون القيمة HR أو Manager
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: تم إنشاء الموظف بنجاح
 *       403:
 *         description: غير مسموح لهذه الصلاحية
 *       400:
 *         description: بيانات غير صحيحة
 *       500:
 *         description: خطأ في الخادم
 */
router.post('/add', authorize(['HR', 'Manager', 'Admin']), addEmployee);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: عرض قائمة الموظفين (مع التصفح والبحث)
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: رقم الصفحة
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: عدد العناصر في الصفحة
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: تصفية حسب القسم
 *     responses:
 *       200:
 *         description: تم جلب القائمة
 */
router.get('/', authorize(['HR', 'Manager', 'Admin']), getAllEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: تحديث بيانات موظف (HR فقط)
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الموظف
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: تم تحديث البيانات
 *       404:
 *         description: الموظف غير موجود
 */
router.put('/:id', authorize(['HR', 'Manager', 'Admin']), updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: الحصول على بيانات موظف محدد
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: معرف الموظف (MongoDB ID)
 *     responses:
 *       200:
 *         description: تم جلب البيانات بنجاح
 */
router.get('/:id', getEmployeeProfile);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: حذف موظف نهائياً
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الموظف
 *     responses:
 *       200:
 *         description: تم حذف الموظف بنجاح
 *       404:
 *         description: الموظف غير موجود
 *       500:
 *         description: خطأ في الخادم
 */
router.delete('/:id', authorize(['HR', 'Manager', 'Admin']), deleteEmployee);


module.exports = router;
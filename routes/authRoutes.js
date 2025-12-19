const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: المصادقة وتسجيل الدخول
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: تسجيل الدخول (بالرقم القومي)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nationalId]
 *             properties:
 *               nationalId:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم تسجيل الدخول
 *       401:
 *         description: بيانات خاطئة
 */
router.post('/login', login);

module.exports = router;

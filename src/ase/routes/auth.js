const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /auth/keylogin:
 *   post:
 *     summary: User Login. 
 *     description: Login to AppScan Enterprise application
 *     tags: 
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyId:
 *                 type: string
 *               keySecret:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.post('/keylogin', authController.keyLogin);

module.exports = router;
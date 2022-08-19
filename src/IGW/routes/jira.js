const express = require('express');
const router = express.Router();
const jiraController = require('../controllers/jiraController');
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");

/**
 * @swagger
 * /jira/login:
 *   post:
 *     summary: User Login. 
 *     description: Login to AppScan Enterprise application and Jira
 *     tags: 
 *       - jira
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
 *               accessToken:
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
router.post('/login', schemas.jiraLogin, validationMsgs.validateRequestSchema, jiraController.jiraLogin);

module.exports = router;
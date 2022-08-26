const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueController");
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");
const tokenValidation = require("../../middleware/tokenValidation");


/**
 * @swagger
 * /issue/job/{jobId}:
 *   get:
 *     summary: Get the issues found by the scan job.
 *     description: Get the issues found by the scan job.
 *     tags: 
 *       - issue
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: traffic
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       201:
 *         description: Successful
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
 router.get("/job/:jobId", tokenValidation.validateToken, schemas.jobId, validationMsgs.validateRequestSchema, issueController.getIssuesOfJob);

 /**
 * @swagger
 * /issue/app/{appId}:
 *   get:
 *     summary: Get the issues of the application.
 *     description: Get the issues of the application.
 *     tags: 
 *       - issue
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Successful
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get("/app/:appId", tokenValidation.validateToken, schemas.appId, validationMsgs.validateRequestSchema, issueController.getIssuesOfApplication);


/**
 * @swagger
 * /issue/application/{appId}/issue/{issueId}:
 *   get:
 *     summary: Get the issue details.
 *     description: Get the issue details.
 *     tags: 
 *       - issue
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Successful
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get("/application/:appId/issue/:issueId", tokenValidation.validateToken, schemas.updateIssue, validationMsgs.validateRequestSchema, issueController.getIssue);

/**
 * @swagger
 * /issue/application/{appId}/issue/{issueId}:
 *   put:
 *     summary: Update the issue attributes.
 *     description: Update the issue attributes.
 *     tags: 
 *       - issue
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       201:
 *         description: Successful
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.put("/application/:appId/issue/:issueId", tokenValidation.validateToken, schemas.updateIssue, validationMsgs.validateRequestSchema, issueController.updateIssue);

/**
 * @swagger
 * /issue/html/application/{appId}/issue/{issueId}:
 *   get:
 *     summary: Get the issue details in HTML file.
 *     description: Get the issue details in HTML file.
 *     tags: 
 *       - issue
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: appId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: issueId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Successful
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
*/ 
router.get("/html/application/:appId/issue/:issueId", tokenValidation.validateToken, schemas.updateIssue, validationMsgs.validateRequestSchema, issueController.getHTMLIssueDetails);

module.exports = router;

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

 module.exports = router;

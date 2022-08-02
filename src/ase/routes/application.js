const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");
const tokenValidation = require("../../middleware/tokenValidation");


/**
 * @swagger
 * /application:
 *   post:
 *     summary: Create an application.
 *     description: <b>name</b> (Required) - Name of application. </BR> <b>description</b>  -  Description of an application. </BR> <b>attributes</b> - Array of application attributes.
 *     tags:
 *       - application
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: false
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
 router.post("/", tokenValidation.validateToken, /*schemas.jobId, validationMsgs.validateRequestSchema,*/ applicationController.createApplication);

 /**
 * @swagger
 * /application/{appId}:
 *   delete:
 *     summary: Delete the application.
 *     description: Delete the application.
 *     tags: 
 *       - application
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
router.delete("/:appId", tokenValidation.validateToken, schemas.appId, validationMsgs.validateRequestSchema, applicationController.deleteApplication);

 /**
 * @swagger
 * /application/{appId}:
 *   get:
 *     summary: Get application details.
 *     description: Get application details.
 *     tags: 
 *       - application
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
router.get("/:appId", tokenValidation.validateToken, schemas.appId, validationMsgs.validateRequestSchema, applicationController.getApplication);

 /**
 * @swagger
 * /application/applications/list:
 *   get:
 *     summary: Get applications list.
 *     description: Get applications list.
 *     tags: 
 *       - application
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
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
router.get("/applications/list", tokenValidation.validateToken, applicationController.getApplications);


 /**
 * @swagger
 * /application/{appId}:
 *   put:
 *     summary: Update application details.
 *     description: Update application details.
 *     tags: 
 *       - application
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               description:
 *                 type: string
 *                 required: false
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
router.put("/:appId", tokenValidation.validateToken, schemas.appId, validationMsgs.validateRequestSchema, applicationController.updateApplication);

module.exports = router;

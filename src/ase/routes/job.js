const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");
const tokenValidation = require("../../middleware/tokenValidation");

/**
 * @swagger
 * /job:
 *   post:
 *     summary: Create a Scan Job.
 *     description: Create a Scan Job in ASE.
 *     tags:
 *       - job
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 required: false
 *                 format: binary
 *                 description: It is a login file recorded using AppScan Standard or AppScan Proxy Server or AppScan Activity Recorder or AppScan Dynamic Analysis Client. The supported file formats are .dast.config (AppScan Proxy Server or Activity Recorder) and .login (AppScan Standard or AppScan Dynamic Analysis Client) https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html 
 *               traffic:
 *                 type: string
 *                 required: false
 *                 format: binary
 *                 description: A traffic file is recorded using AppScan Proxy Server or AppScan Activity Recorder. The supported file formats are .dast.config (AppScan Proxy Server or Activity Recorder) https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html
 *               data:
 *                 type: string
 *                 required: true
 *                 description: Scan configuration data. 
 *               
 *     responses:
 *       200:
 *         description: Successful
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       500:
 *         description: An unknown error has occured.
 */

 router.post("/", tokenValidation.validateToken, jobController.createJob);

 module.exports = router;

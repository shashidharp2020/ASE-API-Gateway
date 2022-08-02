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
 *     description: For more information refer to the help page <a href="https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/CreateScan.md">https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/CreateScan.md</a> 
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
 *                 description: It is a login file recorded using AppScan Standard or AppScan Proxy Server or AppScan Activity Recorder or AppScan Dynamic Analysis Client. </BR>The supported file formats are .dast.config (AppScan Proxy Server or Activity Recorder) and .login (AppScan Standard or AppScan Dynamic Analysis Client) </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html</a> </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html</b>
 *               traffic:
 *                 type: string
 *                 required: false
 *                 format: binary
 *                 description: A traffic file is recorded using AppScan Proxy Server or AppScan Activity Recorder. The supported file formats are .dast.config (AppScan Proxy Server or Activity Recorder) </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html</a> </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html</b>
 *               data:
 *                 type: string
 *                 required: true
 *                 description: Scan configuration data. Refer to the help page <a href="https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/CreateScan.md">https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/CreateScan.md</a>  
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

/**
 * @swagger
 * /job/{jobId}:
 *   put:
 *     summary: Edit a Scan Job.
 *     description: For more information refer to the help page <a href="https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/EditScan.md">https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/EditScan.md</a> 
 *     tags:
 *       - job
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
 *                 description: It is a login file recorded using AppScan Standard or AppScan Proxy Server or AppScan Activity Recorder or AppScan Dynamic Analysis Client. </BR>The supported file formats are .dast.config (AppScan Proxy Server or Activity Recorder) and .login (AppScan Standard or AppScan Dynamic Analysis Client) </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html</a> </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html</b>
 *               traffic:
 *                 type: string
 *                 required: false
 *                 format: binary
 *                 description: A traffic file is recorded using AppScan Proxy Server or AppScan Activity Recorder. The supported file formats are .dast.config (AppScan Proxy Server or Activity Recorder) </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/t_trafficdata_appscan_activity_recorder_2.html</a> </BR> <a href="https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html">https://help.hcltechsw.com/appscan/Enterprise/10.0.7/topics/c_test_automation_ASE_using_appscanproxy_server.html</b>
 *               data:
 *                 type: string
 *                 required: true
 *                 description: Scan configuration data. Refer to the help page <a href="https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/EditScan.md">https://github.com/shashidharp2020/ASE-API-Gateway/blob/main/Help/EditScan.md</a>  
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

router.put("/:jobId", tokenValidation.validateToken, jobController.editJob);
 
 
/**
 * @swagger
 * /job/{jobId}/reportpacks:
 *   get:
 *     summary: Get reportpacks associated to the scan job.
 *     description: Get reportpacks associated to the scan job.
 *     tags: 
 *       - job
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
router.get("/:jobId/reportpacks", tokenValidation.validateToken, schemas.jobId, validationMsgs.validateRequestSchema, jobController.getReportPackForJobId);

/**
 * @swagger
 * /job/reportpack/{reportpackId}/reports:
 *   get:
 *     summary: Get list of reports in reportpack.
 *     description: Get list of reports in reportpack.
 *     tags: 
 *       - job
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: reportpackId
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
router.get("/reportpack/:reportpackId/reports", tokenValidation.validateToken, schemas.reportpackId, validationMsgs.validateRequestSchema, jobController.getReportsInReportPack);


/**
 * @swagger
 * /job/{jobId}:
 *   get:
 *     summary: Get details of the scan job.
 *     description: Get details of the scan job.
 *     tags: 
 *       - job
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
router.get("/:jobId", tokenValidation.validateToken, schemas.jobId, validationMsgs.validateRequestSchema, jobController.getJobDetails);


/**
 * @swagger
 * /job/{jobId}:
 *   delete:
 *     summary: Delete the scan job.
 *     description: Delete the scan job.
 *     tags: 
 *       - job
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
 *         name: reportpacks
 *         required: false
 *         description: true-Deletes associated report packs as well.
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
router.delete("/:jobId", tokenValidation.validateToken, schemas.jobId, validationMsgs.validateRequestSchema, jobController.deleteJob);


/**
 * @swagger
 * /job/{jobId}/action/{actionId}:
 *   put:
 *     summary: Change the status of a scan job.
 *     description: Change the status of a scan job.
 *     tags: 
 *       - job
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
 *       - in: path
 *         name: actionId
 *         required: true
 *         description: 1-Run,  2-Suspend, 3-Cancel, 4-End 
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
router.put("/:jobId/action/:actionId", tokenValidation.validateToken, schemas.jobId, schemas.jobActionId, validationMsgs.validateRequestSchema, jobController.actionOnJob);

/**
 * @swagger
 * /job/search/query:
 *   get:
 *     summary: Search jobs
 *     description: | 
 *       <b>Search jobs</b> </BR>
 *     tags: 
 *       - job
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: query
 *         name: queryString
 *         required: true
 *         description: |
 *           Construct using the below attributes in a 'key=value' format separated by comma. Ex: </BR>
 *           JobName=Test*,StartingURL=http://demo.testfire.net/,CreatedByJobOwnerId=2|3,LastRanBetweenFromAndTodate=2000-09-25|2019-09-25,CreatedBetweenFromAndToDate=2000-09-25|2019-09-25,ModifiedBetweenFromAndToDate=2000-09-25|2019-09-25,ApplicationID=1|3,JobType=1|2 </BR></BR>
 *           <b>Searchable attributes:</b> </BR>
 *           <b>JobName:</b> JobName=demo.testfire.net or JobName=demo* </BR>
 *           <b>StartingURL:</b> Search using starting URL. Ex: StartingURL=http://demo.testfire.net/ or StartingURL=http://demo* </BR>
 *           <b>CreatedByJobOwnerId:</b> Search using creator's Id. This is not for reportpacks. Ex: CreatedByJobOwnerId=2 or CreatedByJobOwnerId=2|3 or CreatedByJobOwnerId=2|3|4 </BR>
 *           <b>LastRanBetweenFromAndToDate:</b> Search using job last ran date range. Ex: LastRanBetweenFromAndTodate=2000-08-25|2019-09-25 </BR>
 *           <b>CreatedBetweenFromAndToDate:</b> Search using job creation date range. Ex: CreatedBetweenFromAndToDate=2000-08-25|2019-09-25 </BR>
 *           <b>ModifiedBetweenFromAndToDate:</b> Search using job modified date range. Ex: ModifiedBetweenFromAndToDate=2000-08-25|2019-09-25 </BR>
 *           <b>ApplicationId:</b> Search using application Ids jobs associated to. Ex: ApplicationId=1 or ApplicationId=1|3 </BR>
 *           <b>JobType:</b> Search using Job types. ex. JobType=1|3 (1 for contentscan jobs; 2 for SCANT jobs; 3 for reports; 4 for importJobs; 5 for all. By default it is 5.) </BR>
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
router.get("/search/query", tokenValidation.validateToken, jobController.jobsSearch);


module.exports = router;

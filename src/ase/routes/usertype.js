const express = require("express");
const router = express.Router();
const usertypeController = require("../controllers/usertypeController");
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");
const tokenValidation = require("../../middleware/tokenValidation");

/**
 * @swagger
 * /usertype:
 *   get:
 *     summary: List all usertypes.
 *     description: List all usertypes present in the AppScan system.
 *     tags:
 *       - usertype
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
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

router.get("/", tokenValidation.validateToken, usertypeController.getAllUserTypes);

/**
 * @swagger
 * /usertype/{userTypeId}:
 *   get:
 *     summary: Get usertype information.
 *     description: Get usertype information for the specified usertype Id.
 *     tags:
 *       - usertype
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userTypeId
 *         required: true
 *         schema:
 *           type: integer
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

router.get("/:userTypeId", tokenValidation.validateToken, schemas.userTypeId, validationMsgs.validateRequestSchema, usertypeController.getUserType);

/**
 * @swagger
 * /usertype:
 *   post:
 *     summary: Create a userType.
 *     description: Create a userType with the details provided. Example of 'permissionids' is '3,5,3'. Refer the API '/usertype/user/permissions' to get the list of permissionids.
 *     tags:
 *       - usertype
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
 *               permissionIds:
 *                 type: string
 *                 required: true
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

router.post("/", tokenValidation.validateToken, schemas.createUserType, validationMsgs.validateRequestSchema, usertypeController.createUserType);

/**
 * @swagger
 * /usertype/{userTypeId}:
 *   delete:
 *     summary: Delete an usertype.
 *     description: Delete an usertype.
 *     tags:
 *       - usertype
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userTypeId
 *         required: true
 *         schema:
 *           type: integer
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

router.delete("/:userTypeId", tokenValidation.validateToken, schemas.userTypeId, validationMsgs.validateRequestSchema, usertypeController.deleteUserType);

/**
 * @swagger
 * /usertype/user/permissions:
 *   get:
 *     summary: List all permissions.
 *     description: List all the permissions the user type can have.
 *     tags:
 *       - usertype
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
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

router.get("/user/permissions", tokenValidation.validateToken, usertypeController.getUserTypePermissions);

/**
 * @swagger
 * /usertype/{userTypeId}:
 *   put:
 *     summary: Edit a userType.
 *     description: Edit a usertype. Example of 'permissionids' is '3,5,3'. Refer the API '/usertype/user/permissions' to get the list of permissionids.
 *     tags:
 *       - usertype
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userTypeId
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
 *               permissionIds:
 *                 type: string
 *                 required: true
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

router.put("/:userTypeId", tokenValidation.validateToken, schemas.createUserType, validationMsgs.validateRequestSchema, usertypeController.editUserType);


module.exports = router;

const express = require("express");
const router = express.Router();
const entitlementsController = require("../controllers/entitlementsController");
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");

/**
 * @swagger
 * /entitlements:
 *   get:
 *     summary: List all entitlements.
 *     description: List all entitlements present in the AppScan system.
 *     tags:
 *       - entitlements
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

router.get("/", entitlementsController.getAllEntitlements);

/**
 * @swagger
 * /entitlements/getentitlementbyname:
 *   post:
 *     summary: Get entitlement information.
 *     description: Get entitlement information of the specified entitlement name.
 *     tags:
 *       - entitlements
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
 *               entitlement_name:
 *                 type: string
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

router.post("/getentitlementbyname", schemas.entitlement_name, validationMsgs.validateRequestSchema, entitlementsController.getEntitlement);

/**
 * @swagger
 * /entitlements:
 *   put:
 *     summary: Create an entitlement.
 *     description: Create an entitlement with the details provided. Example of 'permissionids' is '3,5,3'. Refer the API '/entitlements/permissions' to get the list of permissionids.
 *     tags:
 *       - entitlements
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
 *               permissionids:
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

router.put("/", schemas.createEntitlement, validationMsgs.validateRequestSchema, entitlementsController.createEntitlement);

/**
 * @swagger
 * /entitlements/deleteentitlementbyname:
 *   put:
 *     summary: Delete an entitlement.
 *     description: Delete an entitlement.
 *     tags:
 *       - entitlements
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
 *               entitlement_name:
 *                 type: string
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

router.put("/:deleteentitlementbyname", schemas.entitlement_name, validationMsgs.validateRequestSchema, entitlementsController.deleteEntitlement);

/**
 * @swagger
 * /entitlements/user/permissions:
 *   get:
 *     summary: List all permissions.
 *     description: List all the permissions the entitlement can have.
 *     tags:
 *       - entitlements
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

router.get("/user/permissions", entitlementsController.getAllPermissions);
module.exports = router;

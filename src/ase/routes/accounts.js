const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accountsController");
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");
/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: List all accounts.
 *     description: List all accounts present in the AppScan system.
 *     tags:
 *       - accounts
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

router.get("/", accountsController.getAllAccounts);

/**
 * @swagger
 * /accounts/getAccountByName:
 *   post:
 *     summary: Get account information.
 *     description: Get account information of the specified account name.
 *     tags:
 *       - accounts
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
 *               account_name:
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

router.post("/getAccountByName", accountsController.getAccount);

/**
 * @swagger
 * /accounts:
 *   put:
 *     summary: Create an account.
 *     description: Create an account with the details provided.
 *     tags:
 *       - accounts
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
 *               account_name:
 *                 type: string
 *                 required: true
 *               entitlement_id:
 *                 type: integer
 *                 required: true
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               middle_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Successful
 *       400:
 *         description: Wrong input
 *       403:
 *         description: Invalid token or user does not exist.
 *       409:
 *         description: The account already exists.
 *       500:
 *         description: An unknown error has occured.
 */

router.put("/", schemas.accountCreate, validationMsgs.validateRequestSchema, accountsController.createAccount);

/**
 * @swagger
 * /accounts/update:
 *   put:
 *     summary: Update an account.
 *     description: Update an account with the details provided.
 *     tags:
 *       - accounts
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: accountid
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
 *               account_name:
 *                 type: string
 *                 required: true
 *               entitlement_name:
 *                 type: string
 *                 required: true
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               middle_name:
 *                 type: string
 *               last_name:
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

router.put("/update", schemas.accountUpdate, validationMsgs.validateRequestSchema, accountsController.updateAccount);

/**
 * @swagger
 * /accounts/enable:
 *   put:
 *     summary: Enable an account.
 *     description: Enable an account.
 *     tags:
 *       - accounts
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
 *               account_name:
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

router.put("/enable", schemas.account_name, validationMsgs.validateRequestSchema, accountsController.enableAccount);

/**
 * @swagger
 * /accounts/disable:
 *   put:
 *     summary: Disable an account.
 *     description: Disable an account.
 *     tags:
 *       - accounts
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
 *               account_name:
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

router.put("/disable", schemas.account_name, validationMsgs.validateRequestSchema, accountsController.disableAccount);

/**
 * @swagger
 * /accounts/delete:
 *   put:
 *     summary: Delete an account.
 *     description: Delete an account.
 *     tags:
 *       - accounts
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
 *               account_name:
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

router.put("/:accountid", schemas.account_name, validationMsgs.validateRequestSchema, accountsController.deleteAccount);

module.exports = router;

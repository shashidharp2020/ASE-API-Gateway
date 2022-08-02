const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validationMsgs = require("../../middleware/validate-request-schema");
const schemas = require("../../validation-schema/validationSchemas");
const tokenValidation = require("../../middleware/tokenValidation");

/**
 * @swagger
 * /user:
 *   get:
 *     summary: List all user accounts.
 *     description: List all user accounts present in the AppScan system.
 *     tags:
 *       - user
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

router.get("/", tokenValidation.validateToken, userController.getAllUserAccounts);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user account information.
 *     description: Get user account information for the specified account Id.
 *     tags:
 *       - user
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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

router.get("/:userId", tokenValidation.validateToken, userController.getUserAccount);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create an account.
 *     description: Create an account with the details provided.
 *     tags:
 *       - user
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
 *               userName:
 *                 type: string
 *                 required: true
 *               userTypeId:
 *                 type: integer
 *                 required: true
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
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

router.post("/", tokenValidation.validateToken, schemas.accountCreate, validationMsgs.validateRequestSchema, userController.createUserAccount);

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Edit an account.
 *     description: Edit an account with the details provided.
 *     tags:
 *       - user
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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
 *               userTypeId:
 *                 type: integer
 *                 required: true
 *               email:
 *                 type: string
 *               fullName:
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

router.put("/:userId", tokenValidation.validateToken, schemas.accountUpdate, validationMsgs.validateRequestSchema, userController.updateUserAccount);

/**
 * @swagger
 * /user/enable/{userId}:
 *   put:
 *     summary: Enable an account.
 *     description: Enable an account.
 *     tags:
 *       - user
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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

router.put("/enable/:userId", tokenValidation.validateToken, schemas.userId, validationMsgs.validateRequestSchema, userController.enableUserAccount);

/**
 * @swagger
 * /user/disable/{userId}:
 *   put:
 *     summary: Disable an user account.
 *     description: Disable an user account.
 *     tags:
 *       - user
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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

router.put("/disable/:userId", tokenValidation.validateToken, schemas.userId, validationMsgs.validateRequestSchema, userController.disableUserAccount);

/**
 * @swagger
 * /user/delete/{userId}:
 *   put:
 *     summary: Delete an user account.
 *     description: Delete an user account.
 *     tags:
 *       - user
 *     parameters:
 *       - in: header
 *         name: auth-token
 *         required: true
 *         description: Provide the token returned by /login API in the format "bearer auth-token"
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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

router.put("/delete/:userId", tokenValidation.validateToken, schemas.userId, validationMsgs.validateRequestSchema, userController.deleteUserAccount);

module.exports = router;

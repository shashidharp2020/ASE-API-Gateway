const { param, body } = require("express-validator");
const constants = require("../utils/constants");

var schemas = {};

schemas.userId = param("userId").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_USER_ACCOUNT_ID);
schemas.userTypeId = param("userTypeId").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_USERTYPE_ID);
schemas.userName = body("userName").exists().withMessage(constants.INVALID_ACCOUNT_USER_NAME);
schemas.userTypeIdInBody = body("userTypeId").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_USERTYPE_ID);
schemas.email = body("email").isEmail().withMessage(constants.INVALID_EMAIL);
schemas.fullName = body("fullName").isString({ min: 4, max: 20 }).withMessage(constants.INVALID_FULL_NAME);

schemas.accountCreate = [schemas.userName, schemas.userTypeIdInBody, schemas.email, schemas.fullName];
schemas.accountUpdate = [schemas.userTypeIdInBody, schemas.email, schemas.fullName];

schemas.userTypeName = body("name").isString({ min: 4, max: 20 }).withMessage(constants.INVALID_USERTYPE_NAME);
schemas.userTypeDesc = body("description").isString({ min: 4, max: 200 }).withMessage(constants.INVALID_USERTYPE_DESC);
schemas.permissionids = body("permissionIds")
	.matches(/(\d|,)/)
	.withMessage(constants.INVALID_USERTYPE_PERMISSIONIDS);
schemas.createUserType = [schemas.userTypeName, schemas.userTypeDesc, schemas.permissionids];

//////////////////
schemas.jobId = param("jobId").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_JOB_ID);
schemas.appId = param("appId").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_APP_ID);
schemas.issueId = param("issueId").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_ISSUE_ID);
schemas.reportpackId = param("reportpackId").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_REPORTPACK_ID);
schemas.jobActionId = param("actionId").isInt({ min:1, max: 4}).withMessage(constants.INVALID_JOB_ACTION_ID);

schemas.updateIssue = [schemas.appId, schemas.issueId];
module.exports = schemas;

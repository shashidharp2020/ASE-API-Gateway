const { param, body } = require("express-validator");
const constants = require("../utils/constants");

var schemas = {};

schemas.accountid = param("accountid").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_ACCOUNT_ID);
schemas.entitlementid = param("entitlementid").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_ENTITLEMENT_ID);
schemas.entitlement_name = body("entitlement_name").isString({ min: 4, max: 20 }).withMessage(constants.INVALID_ENTITLEMENT_NAME);
schemas.account_name = body("account_name").exists().withMessage(constants.INVALID_ACCOUNT_NAME);
schemas.entitlement_id = body("entitlement_id").isInt().isLength({ min: 1, max: 6 }).withMessage(constants.INVALID_ENTITLEMENT_ID);
schemas.email = body("email").isEmail().withMessage(constants.INVALID_EMAIL);
schemas.first_name = body("first_name").isString({ min: 4, max: 20 }).withMessage(constants.INVALID_FIRST_NAME);
schemas.middle_name = body("middle_name").isString({ min: 0, max: 20 }).withMessage(constants.INVALID_MIDDLE_NAME);
schemas.last_name = body("last_name").isString({ min: 0, max: 20 }).withMessage(constants.INVALID_LAST_NAME);

schemas.accountCreate = [schemas.account_name, schemas.entitlement_id, schemas.email, schemas.first_name, schemas.last_name];
schemas.accountUpdate = [schemas.account_name, schemas.entitlement_name, schemas.email, schemas.first_name, schemas.last_name];

schemas.entName = body("name").isString({ min: 4, max: 20 }).withMessage(constants.INVALID_ENTITLEMENT_NAME);
schemas.entDesc = body("description").isString({ min: 4, max: 200 }).withMessage(constants.INVALID_ENTITLEMENT_DESC);
schemas.permissionids = body("permissionids")
	.matches(/(\d|,)/)
	.withMessage(constants.INVALID_ENTITLEMENT_PERMISSIONIDS);
schemas.createEntitlement = [schemas.entName, schemas.entDesc, schemas.permissionids];
module.exports = schemas;

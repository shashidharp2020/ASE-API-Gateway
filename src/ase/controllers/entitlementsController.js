const log4js = require("log4js");
const logger = log4js.getLogger("entitlementsController");
const jsonwebtoken = require("../../utils/jsonwebtoken");
const https = require("https");
const util = require("../../utils/util");
const constants = require("../../utils/constants");

var methods = {};
methods.getAllEntitlements = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);
	const entitlements = await methods.getEntitlements(token);

	if (entitlements.length > 0) {
		logger.info("getAllEntitlements: Successfully retrieved all the entitlements");
		return res.status(200).json(entitlements);
	} else {
		logger.error("getAllEntitlements: Failed to retrieve the entitlements");
		return res.status(400).json({ message: constants.WRONG_INPUT });
	}
};

methods.getEntitlementsMap = async (token) => {
	const entitlements = await methods.getEntitlements(token);
	var entitlementsMap = new Map();

	entitlements.forEach((entitlement) => {
		entitlementsMap.set(entitlement[constants.ENTITLEMENT_ID], entitlement[constants.ENTITLEMENT_NAME]);
	});

	return entitlementsMap;
};

methods.getEntitlementsByName = async (token, entitlementName) => {
	const entitlements = await methods.getEntitlements(token);
	var entl = null;

	await entitlements.forEach((entitlement) => {
		if (entitlement[constants.ENTITLEMENT_NAME] === entitlementName) entl = entitlement;
	});

	return entl;
};

methods.getEntitlements = (token) => {
	try {
		return new Promise((resolve) => {
			const options = util.httpOption(token, "GET", constants.ASE_GET_USERTYPES);
			var data = [];

			const req1 = https.request(options, (res1) => {
				if (res1.statusCode !== 200) {
					logger.error("getAllEntitlements - " + res1.statusCode + " : " + res1.statusMessage);
					resolve(data);
					return;
				}
				res1.on("data", function (d) {
					var appData = {};
					var userTypes = JSON.parse(d);

					userTypes.forEach((userType) => {
						appData[constants.ENTITLEMENT_ID] = userType[constants.ID];
						appData[constants.ENTITLEMENT_NAME] = userType[constants.NAME];
						appData[constants.ENT_OWNER] = "";
						appData[constants.ENT_TYPE] = "Group";
						appData[constants.DISPLAY_NAME] = userType[constants.NAME];
						appData[constants.DESCRIPTION] = userType[constants.DESCRIPTION];
						appData[constants.IS_PRIVILEGED] = userType[constants.ID] === 5;
						appData[constants.REQUESTABLE] = true;
						appData[constants.BIRTHRIGHT] = false;
						appData[constants.GENERIC_ATTR_1] = "";
						appData[constants.GENERIC_ATTR_2] = "";
						appData[constants.GENERIC_ATTR_3] = "";
						appData[constants.GENERIC_ATTR_4] = "";
						appData[constants.GENERIC_ATTR_5] = "";
						data.push(appData);
						appData = {};
					});
				}).on("error", (error) => {
					logger.error("getAllEntitlements - " + error);
				});

				resolve(data);
			});

			req1.end();
		});
	} catch (error) {
		logger.error("getAllEntitlements API failed :" + error);
	}
};

methods.getEntitlement = async (req, res) => {
	try {
		const token = jsonwebtoken.getTokenData(req);
		const entitlementName = req.body.entitlement_name;

		if (typeof entitlementName === "undefined" || entitlementName === null) return res.status(400).json({ message: constants.WRONG_INPUT });
		const entlmt = await methods.getEntitlementsByName(token, entitlementName);

		if (typeof entlmt !== "undefined" && entlmt !== null) {
			logger.info("getEntitlement: Successfully retrieved the information of the entitlement of id " + req.params.entitlementid);
			return res.status(200).json(entlmt);
		} else {
			logger.error("getEntitlement: Failed to retrieve the information of entitlement id " + req.params.entitlementid);
			return res.status(400).json({ message: constants.WRONG_INPUT });
		}
	} catch (error) {
		logger.error("getEntitlement: Failed to retrieve the information of entitlement id " + req.params.entitlementid + " - " + error);
		return res.status(500).json({ message: error });
	}
};

methods.createEntitlement = (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("createEntitlement - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	const data = JSON.stringify({
		name: req.body.name,
		description: req.body.description,
		permissionIds: req.body.permissionids,
	});

	const options = util.httpOption(token, "POST", constants.ASE_CREATE_USERTYPE, data.length);

	try {
		const req1 = https.request(options, async (res1) => {
			if (res1.statusCode === 200) {
				var entitlement = await methods.getEntitlementsByName(token, req.body.name);

				if (entitlement != null) {
					logger.info("createEntitlement: Successfully created the entitlement of name " + req.body.name);
					return res.status(res1.statusCode).json(entitlement);
				} else return res.status(500).json({ message: "Failure" });
			} else {
				logger.error(
					"createEntitlement: Failed to create the entitlement with name " + req.body.name + " - " + res1.statusCode + " : " + res1.statusMessage
				);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
		});

		req1.write(data);
		req1.end();
	} catch (error) {
		logger.error("createEntitlement: Failed to create the entitlement with name " + req.body.name + " - " + error);
		res.status(500).json({ message: error });
	}
};

methods.deleteEntitlement = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("deleteEntitlement - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	const entitlementName = req.body.entitlement_name;

	if (typeof entitlementName === "undefined" || entitlementName === null) return res.status(400).json({ message: constants.WRONG_INPUT });
	const entlmt = await methods.getEntitlementsByName(token, entitlementName);
	if (typeof entlmt === "undefined" || entlmt === null) return res.status(400).json({ message: constants.WRONG_INPUT });

	const options = util.httpOption(token, "DELETE", constants.ASE_DELETE_USERTYPE + "/" + entlmt.entitlement_id);

	try {
		const req1 = https.request(options, (res1) => {
			if (res1.statusCode === 200) {
				logger.info("deleteEntitlement: Successfully deleted the entitlement of id " + entlmt.entitlement_id);
				return res.status(res1.statusCode).json({ message: "Succes" });
			} else {
				logger.error(
					"deleteEntitlement: Failed to delete the entitlement of id " + entlmt.entitlement_id + " - " + res1.statusCode + " : " + res1.statusMessage
				);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
		});

		req1.end();
	} catch (error) {
		logger.error("deleteEntitlement: Failed to delete the entitlement of id " + req.params.entitlementid + " - " + error);
		res.status(500).json({ message: error });
	}
};

methods.getAllPermissions = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("getAllPermissions - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	const options = util.httpOption(token, "GET", constants.ASE_GET_PERMISSIONS);

	try {
		const req1 = https.request(options, (res1) => {
			if (res1.statusCode !== 200) {
				logger.error("getAllPermissions - " + res1.statusCode + " : " + res1.statusMessage);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
			res1.on("data", async (d) => {
				return res.status(200).json(JSON.parse(d));
			}).on("error", (error) => {
				logger.error("getAllPermissions - " + error);
				return res.status(400).json({ message: constants.WRONG_INPUT });
			});
		});

		req1.end();
	} catch (error) {
		logger.error("getAllPermissions - " + error);
		res.status(500).json({ message: error });
	}
};

module.exports = methods;

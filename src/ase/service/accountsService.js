const log4js = require("log4js");
const logger = log4js.getLogger("accountsController");
const jsonwebtoken = require("../../utils/jsonwebtoken");
const https = require("https");
const util = require("../../utils/util");
const entitlementsController = require("../controllers/entitlementsController");
const constants = require("../../utils/constants");
const accountsController = require("../controllers/accountsController");

var methods = {};

methods.getAccount = (accountId, token) => {
	const options = util.httpOption(token, "GET", constants.ASE_CONSOLEUSERS + accountId);

	try {
		return new Promise((resolve, reject) => {
			const req1 = https.request(options, (res1) => {
				if (res1.statusCode !== 200) {
					logger.error("getAccount: Failed to fetch information for account Id " + accountId + " - " + res1.statusCode + " : " + res1.statusMessage);
					reject(res1.statusCode);
				}
				res1.on("data", async (d) => {
					var account = JSON.parse(d);
					var entitlements = await entitlementsController.getEntitlementsMap(token);

					if (account[constants.ISGROUP] === true) reject(400);

					logger.info("getAccount: Successfully fetched the information of account Id " + accountId);
					var accountObj = methods.getJSONAccountObject(entitlements, account);
					resolve(accountObj);
				}).on("error", (error) => {
					logger.error("getAccount: Failed to fetch the information for account Id " + accountId + " - " + error);
					reject(400);
				});
			});

			req1.end();
		});
	} catch (error) {
		logger.error("getAccount: Failed to fetch the information for account Id " + accountId + " - " + error);
		reject(500);
	}
};

methods.getJSONAccountObject = (entitlements, account) => {
	var appData = {};
	appData[constants.ACCOUNT_ID] = account[constants.USERID];
	appData[constants.ACCOUNT_NAME] = account[constants.USERNAME];
	appData[constants.ACCOUNT_STATUS] = account[constants.USERTYPEID] === 2 ? constants.INACTIVE : constants.ACTIVE;
	appData[constants.EMAIL] = account[constants.EMAIL];
	appData[constants.IS_PRIVILEGED] = account[constants.USERTYPEID] === 5;
	appData[constants.ENTITLEMENTS] = entitlements.get(account[constants.USERTYPEID]);
	appData[constants.CORRELATION_ATTR_1] = account[constants.USERNAME].includes("\\")
		? account[constants.USERNAME].split("\\")[1]
		: account[constants.USERNAME];
	appData[constants.ACCOUNT_TYPE] = constants.ACCOUNT_TYPE_REGULAR;
	const userObj = util.resolveFullName(account[constants.FULLNAME]);
	appData[constants.FIRST_NAME] = userObj[constants.FIRST_NAME];
	appData[constants.MIDDLE_NAME] = userObj[constants.MIDDLE_NAME];
	appData[constants.LAST_NAME] = userObj[constants.LAST_NAME];
	appData[constants.GENERIC_ATTR_1] = "";
	appData[constants.GENERIC_ATTR_2] = "";
	appData[constants.GENERIC_ATTR_3] = "";
	appData[constants.GENERIC_ATTR_4] = "";
	appData[constants.GENERIC_ATTR_5] = "";

	return appData;
};

methods.getAllAccounts = (token) => {
	const options = util.httpOption(token, "GET", constants.ASE_CONSOLEUSERS);

	return new Promise((resolve, reject) => {
		try {
			const req1 = https.request(options, (res1) => {
				if (res1.statusCode !== 200) {
					logger.error("getAllAccounts: Failed to list all the accounts - " + res1.statusCode + " : " + res1.statusMessage);
					reject(res1.statusCode);
				}
				res1.on("data", async (d) => {
					var data = [];
					var accounts = JSON.parse(d);
					var entitlements = await entitlementsController.getEntitlementsMap(token);

					accounts.forEach((account) => {
						if (account[constants.ISGROUP] !== true) {
							data.push(methods.getJSONAccountObject(entitlements, account));
						}
					});

					logger.info("getAllAccounts: Successfully listed all the accounts");
					resolve(data);
				}).on("error", (error) => {
					logger.error("getAllAccounts: Error in listing all the accounts - " + error);
					reject(error);
				});
			});

			req1.end();
		} catch (error) {
			logger.error("getAllAccounts: Error in listing all the accounts - " + error);
			reject(500);
		}
	});
};

module.exports = methods;

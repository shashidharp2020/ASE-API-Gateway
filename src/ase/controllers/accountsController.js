const log4js = require("log4js");
const logger = log4js.getLogger("accountsController");
const jsonwebtoken = require("../../utils/jsonwebtoken");
const https = require("https");
const util = require("../../utils/util");
const entitlementsController = require("../controllers/entitlementsController");
const constants = require("../../utils/constants");
const accountsService = require("../service/accountsService");

var methods = {};
methods.getAllAccounts = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("getAllAccounts - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	try {
		const accounts = await accountsService.getAllAccounts(token);
		return res.status(200).json(accounts);
	} catch (error) {
		return res.status(error).json({ message: constants.WRONG_INPUT });
	}
};

methods.getAccount = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("getAccount - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	try {
		var account = {};
		const accounts = await accountsService.getAllAccounts(token);
		const accountName = req.body.account_name;
		account = accounts.find((act) => act[constants.ACCOUNT_NAME] === accountName);

		if (account) return res.status(200).json(account);
		else return res.status(404).json({ message: constants.ACCOUNT_NOT_EXIST });
	} catch (error) {
		return res.status(500).json({ message: constants.WRONG_INPUT });
	}
};

methods.createAccount = (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("createAccount - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	const userName = util.constuctFullName(req.body.first_name, req.body.middle_name, req.body.last_name);

	if (userName === null) {
		logger.error("createAccount: First and last names cannot be empty.");
		return res.status(400).json({ message: constants.WRONG_INPUT });
	}

	const data = JSON.stringify({
		userName: req.body.account_name,
		userTypeId: req.body.entitlement_id,
		email: req.body.email,
		fullName: userName,
	});

	const options = util.httpOption(token, "POST", constants.ASE_CONSOLEUSERS, data.length);

	try {
		const req1 = https.request(options, (res1) => {
			if (res1.statusCode !== 200) {
				logger.error(
					"createAccount: Failed to create an account for user " + req.body.account_name + " -  " + res1.statusCode + " : " + res1.statusMessage
				);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
			res1.on("data", async (d) => {
				var account = JSON.parse(d);
				var entitlements = await entitlementsController.getEntitlementsMap(token);
				logger.info("createAccount: Successfully created the account with name " + req.body.account_name);
				return res.status(200).json(accountsService.getJSONAccountObject(entitlements, account));
			}).on("error", (error) => {
				logger.error("createAccount: Failed to create an account for user " + req.body.account_name + " -  " + error);
				return res.status(400).json({ message: constants.WRONG_INPUT });
			});
		});

		req1.write(data);
		req1.end();
	} catch (error) {
		logger.error("createAccount: Failed to create an account for user " + req.body.account_name + " -  " + error);
		res.status(500).json({ message: error });
	}
};

methods.updateAccount = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("updateAccount: " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	const userName = util.constuctFullName(req.body.first_name, req.body.middle_name, req.body.last_name);
	if (userName === null) {
		logger.error("updateAccount: First and last names cannot be empty.");
		return res.status(400).json({ message: constants.WRONG_INPUT });
	}

	const accounts = await accountsService.getAllAccounts(token);
	const accountName = req.body.account_name;
	const account = accounts.find((act) => act[constants.ACCOUNT_NAME] === accountName);

	const entitlement = await entitlementsController.getEntitlementsByName(token, req.body.entitlement_name);

	if (!account) return res.status(404).json({ message: constants.ACCOUNT_NOT_EXIST });

	const data = JSON.stringify({
		userTypeId: entitlement !== null ? entitlement[constants.ENTITLEMENT_ID] : account[constants.USERTYPEID],
		email: req.body.email,
		fullName: userName,
	});

	const options = util.httpOption(token, "PUT", constants.ASE_CONSOLEUSERS + account[constants.ACCOUNT_ID], data.length);

	try {
		const req1 = https.request(options, (res1) => {
			if (res1.statusCode === 200) {
				logger.info("updateAccount: Successfully updated the account of " + accountName);
				return res.status(200).json({ message: constants.SUCCESS });
			} else {
				logger.error("updateAccount: Failed to update the account of " + accountName + " - " + res1.statusCode + " : " + res1.statusMessage);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
		});

		req1.write(data);
		req1.end();
	} catch (error) {
		logger.error("updateAccount: Failed to update the account of " + accountName + " - " + error);
		res.status(500).json({ message: error });
	}
};

methods.enableAccount = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("enableAccount - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	const accounts = await accountsService.getAllAccounts(token);
	const accountName = req.body.account_name;
	const account = accounts.find((act) => act[constants.ACCOUNT_NAME] === accountName);

	if (!account) {
		return res.status(404).json({ message: "Account does not exist." });
	}
	const userName = util.constuctFullName(account["first_name"], account["middle_name"], account["last_name"]);
	if (userName === null) {
		return res.status(500).json({ message: "Bad data" });
	}

	const data = JSON.stringify({
		userTypeId: process.env.DEFAULT_USER_TYPE_ID,
		fullName: userName,
	});

	const options = util.httpOption(token, "PUT", constants.ASE_CONSOLEUSERS + account[constants.ACCOUNT_ID], data.length);

	try {
		const req1 = https.request(options, (res1) => {
			if (res1.statusCode === 200) {
				logger.info("enableAccount: Successfully enabled the account " + accountName);
				return res.status(200).json({ message: constants.SUCCESS });
			} else {
				logger.error("enableAccount: Failed to enable the account " + accountName + " - " + res1.statusCode + " : " + res1.statusMessage);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
		});

		req1.write(data);
		req1.end();
	} catch (error) {
		logger.error("enableAccount: Failed to enable the account " + accountName + " - " + error);
		res.status(500).json({ message: error });
	}
};

methods.disableAccount = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("disableAccount - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	//const account = await accountsService.getAccount(req.params.accountid, token);
	const accounts = await accountsService.getAllAccounts(token);
	const accountName = req.body.account_name;
	const account = accounts.find((act) => act[constants.ACCOUNT_NAME] === accountName);

	if (!account) return res.status(404).json({ message: "Account does not exist." });

	const userName = util.constuctFullName(account["first_name"], account["middle_name"], account["last_name"]);
	if (userName === null) {
		return res.status(500).json({ message: constants.BAD_DATA });
	}

	const data = JSON.stringify({
		userTypeId: 2,
		fullName: userName,
	});

	const options = util.httpOption(token, "PUT", constants.ASE_CONSOLEUSERS + account[constants.ACCOUNT_ID], data.length);

	try {
		const req1 = https.request(options, (res1) => {
			if (res1.statusCode === 200) {
				logger.info("disableAccount: Successfully disabled the account " + accountName);
				return res.status(200).json({ message: constants.SUCCESS });
			} else {
				logger.error("disableAccount: Failed to disable the account " + accountName + " - " + res1.statusCode + " : " + res1.statusMessage);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
		});

		req1.write(data);
		req1.end();
	} catch (error) {
		logger.error("disableAccount: Failed to disable the account " + accountName + " - " + error);
		res.status(500).json({ message: error });
	}
};

methods.deleteAccount = async (req, res) => {
	const token = jsonwebtoken.getTokenData(req);

	if (token == null || token.length === 0) {
		logger.error("deleteAccount - " + constants.TOKEN_ABSENT);
		return res.status(403).json({ message: constants.TOKEN_ABSENT });
	}

	const accounts = await accountsService.getAllAccounts(token);
	const accountName = req.body.account_name;
	const account = accounts.find((act) => act[constants.ACCOUNT_NAME] === accountName);
	if (!account) return res.status(404).json({ message: "Account does not exist." });

	const options = util.httpOption(token, "DELETE", constants.ASE_CONSOLEUSERS + account[constants.ACCOUNT_ID]);

	try {
		const req1 = https.request(options, (res1) => {
			if (res1.statusCode === 200) {
				logger.info("deleteAccount: Successfully deleted the account " + accountName);
				return res.status(200).json({ message: constants.SUCCESS });
			} else {
				logger.error("deleteAccount: Failed to delete the account " + accountName + " - " + res1.statusCode + " : " + res1.statusMessage);
				return res.status(res1.statusCode).json({ message: res1.statusMessage });
			}
		});

		req1.end();
	} catch (error) {
		logger.error("deleteAccount: Failed to delete the account " + accountName + " - " + error);
		res.status(500).json({ message: error });
	}
};

module.exports = methods;

const log4js = require("log4js");
const logger = log4js.getLogger("userController");
const userService = require("../service/userService");

var methods = {};

methods.getAllUserAccounts = async (req, res) => {
	try{
		const result = await userService.getAllUserAccounts(req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to retrieve user accounts present in the system: "+JSON.stringify(error));
        return res.status(500).send("Failed to retrieve user accounts present in the system");
	}
};


methods.getUserAccount = async (req, res) => {
	try{
		const result = await userService.getUserAccount(req.params.userId, req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to retrieve user account for Id:"+req.params.userId + ": "+ JSON.stringify(error));
        return res.status(500).send("Failed to retrieve user account");
	}
};


methods.createUserAccount = async (req, res) => {
	try{
		const result = await userService.createUserAccount(req.body, req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to create user account: "+ JSON.stringify(error));
        return res.status(500).send("Failed to create user account");
	}	
};

methods.updateUserAccount = async (req, res) => {
	try{
		const result = await userService.updateUserAccount(req.params.userId, req.body, req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to create user account: "+ JSON.stringify(error));
        return res.status(500).send("Failed to create user account");
	}	
};


methods.enableUserAccount = async (req, res) => {
	try{
		var data = {"userTypeId": 1};
		const result = await userService.updateUserAccount(req.params.userId, data, req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to enable user account: "+req.params.userId+ " - "+ JSON.stringify(error));
        return res.status(500).send("Failed to enable user account");
	}	
};

methods.disableUserAccount = async (req, res) => {
	try{
		var data = {"userTypeId": 2};
		const result = await userService.updateUserAccount(req.params.userId, data, req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to disable user account: "+ JSON.stringify(error));
        return res.status(500).send("Failed to enable user account");
	}	
};

methods.deleteUserAccount = async (req, res) => {
	try{
		const result = await userService.deleteUserAccount(req.params.userId, req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to delete user account: "+ JSON.stringify(error));
        return res.status(500).send("Failed to delete user account");
	}	
};

// methods.deleteAccount = async (req, res) => {
// 	const token = jsonwebtoken.getTokenData(req);

// 	if (token == null || token.length === 0) {
// 		logger.error("deleteAccount - " + constants.TOKEN_ABSENT);
// 		return res.status(403).json({ message: constants.TOKEN_ABSENT });
// 	}

// 	const accounts = await userService.getAllAccounts(token);
// 	const accountName = req.body.account_name;
// 	const account = accounts.find((act) => act[constants.ACCOUNT_NAME] === accountName);
// 	if (!account) return res.status(404).json({ message: "Account does not exist." });

// 	const options = util.httpASEOption(token, "DELETE", constants.ASE_CONSOLEUSERS + account[constants.ACCOUNT_ID]);

// 	try {
// 		const req1 = https.request(options, (res1) => {
// 			if (res1.statusCode === 200) {
// 				logger.info("deleteAccount: Successfully deleted the account " + accountName);
// 				return res.status(200).json({ message: constants.SUCCESS });
// 			} else {
// 				logger.error("deleteAccount: Failed to delete the account " + accountName + " - " + res1.statusCode + " : " + res1.statusMessage);
// 				return res.status(res1.statusCode).json({ message: res1.statusMessage });
// 			}
// 		});

// 		req1.end();
// 	} catch (error) {
// 		logger.error("deleteAccount: Failed to delete the account " + accountName + " - " + error);
// 		res.status(500).json({ message: error });
// 	}
// };

module.exports = methods;

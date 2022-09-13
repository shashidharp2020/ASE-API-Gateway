const log4js = require("log4js");
const logger = log4js.getLogger("authController");
const jsonwebtoken = require('../../utils/jsonwebtoken');
const authService = require('../service/authService');

var methods = {};

methods.keyLogin = async (req, res) =>
{
    try{
		const result = await authService.keyLogin(req.body);
        var token = jsonwebtoken.createToken(result.data.sessionId);
        //res.cookie(constants.ASC_SESSION_ID, result.data.sessionId);
		return res.status(result.code).json({"token": token});
	}
	catch(error) {
		logger.error("Failed to login to the AppScan Enterprise : "+JSON.stringify(error));
        return res.status(500).send("Failed to login to the AppScan Enterprise");
	}
}


module.exports = methods;
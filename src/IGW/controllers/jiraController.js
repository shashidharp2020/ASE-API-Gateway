const log4js = require("log4js");
const logger = log4js.getLogger("igwController");
const jsonwebtoken = require("../../utils/jsonwebtoken");
const https = require("https");
const util = require("../../utils/util");
const constants = require("../../utils/constants");
const jiraService = require("../services/jiraService");
const authService = require("../../ase/service/authService")

var methods = {};

methods.jiraLogin = async (req, res) => {
	try{
		var aseData = {};
		aseData[constants.keyId] = req.body.keyId;
		aseData[constants.keySecret] = req.body.keySecret;
        const result = await authService.keyLogin(aseData);
		const jiraValidation = await jiraService.jiraValidateToken(req.body.accessToken);
		if(result.code === 200 && jiraValidation.code === 200){
			var data = {};
			data[constants.TOKEN] = result.sessionId;
			data[constants.DTS_TOKEN] = req.body.accessToken;
			data[constants.DTS] = constants.DTS_JIRA;
			var jwtToken = jsonwebtoken.createToken(data);
			return res.status(200).json({"token": jwtToken});
		}
		else if (result.code != 200)
			return res.status(result.code).json(result.data);
		else if (jiraValidation.code != 200)	
			return res.status(jiraValidation.code).json(jiraValidation.data);
	}
	catch(error) {
		logger.error("Login failed: "+JSON.stringify(error));
        return res.status(500).send("Login failed");
	}
};


module.exports = methods;

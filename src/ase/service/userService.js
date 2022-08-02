const https = require("https");
const util = require("../../utils/util");
const constants = require("../../utils/constants");

var methods = {};

methods.getAllUserAccounts = async (token) => {
	const url = constants.ASE_CONSOLEUSERS;
    return await util.httpCall("GET", token, url); 
};

methods.getUserAccount = async (userId, token) => {
	const url = constants.ASE_CONSOLE_USER.replace("{USERID}", userId);
    return await util.httpCall("GET", token, url); 
};

methods.createUserAccount = async (data, token) => {
	const url = constants.ASE_CONSOLEUSERS;
    return await util.httpCall("POST", token, url, JSON.stringify(data)); 
};

methods.updateUserAccount = async (userId, data, token) => {
	const url = constants.ASE_CONSOLE_USER.replace("{USERID}", userId);
    return await util.httpCall("PUT", token, url, JSON.stringify(data)); 
};

methods.deleteUserAccount = async (userId, token) => {
	const url = constants.ASE_CONSOLE_USER.replace("{USERID}", userId);
    return await util.httpCall("DELETE", token, url); 
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


module.exports = methods;

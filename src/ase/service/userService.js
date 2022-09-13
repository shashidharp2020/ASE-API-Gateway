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

module.exports = methods;

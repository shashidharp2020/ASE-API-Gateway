const log4js = require("log4js");
const logger = log4js.getLogger("jobService");
const https = require("https");
const util = require("../../utils/util");
const constants = require("../../utils/constants");

var methods = {};

methods.keyLogin = async (inputData) => {
    const url = constants.ASE_API_KEYLOGIN;
    return await util.httpCall("POST","", url, JSON.stringify(inputData));
};

module.exports = methods;
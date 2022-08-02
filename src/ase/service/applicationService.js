const log4js = require("log4js");
const logger = log4js.getLogger("jobService");
const https = require("https");
const util = require("../../utils/util");
const constants = require("../../utils/constants");

var methods = {};

methods.createApplication = async (inputData, token) => {
    const url = constants.ASE_CREATE_APPLICATION;
    return await util.httpCall("POST",token, url, JSON.stringify(inputData));
};

methods.updateApplication = async (inputData, appId, etag, token) => {
    const url = constants.ASE_UPDATE_APPLICATION.replace("{APPID}", appId);
    return await util.httpCall("PUT",token, url, JSON.stringify(inputData), etag);
};

methods.deleteApplicaiton = async (appId, token) => {
    const url = constants.ASE_DELETE_APPLICATION.replace("{APPID}", appId);
    return await util.httpCall("DELETE",token, url);
};

methods.getApplicaiton = async (appId, token) => {
    const url = constants.ASE_GET_APPLICATION.replace("{APPID}", appId);
    return await util.httpCall("GET",token, url);
};

methods.getApplicaitons = async (token) => {
    const url = constants.ASE_GET_APPLICATIONS;
    return await util.httpCall("GET",token, url);
};

module.exports = methods;
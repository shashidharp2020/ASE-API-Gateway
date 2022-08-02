const util = require("../../utils/util");
const constants = require("../../utils/constants");


var methods = {};

methods.getAllUserTypes = async (token) => {
    const url = constants.ASE_USER_TYPES;
    return await util.httpCall("GET", token, url);    
};

methods.createUserType = async (data, token) => {
    const url = constants.ASE_CREATE_USER_TYPE;
    return await util.httpCall("POST", token, url, JSON.stringify(data));    
};

methods.deleteUserType = async (userTypeId, token) => {
    const url = constants.ASE_DELETE_USER_TYPE.replace("{USERTYPEID}", userTypeId);
    return await util.httpCall("DELETE", token, url);    
};

methods.getUserTypePermissions = async (token) => {
    const url = constants.ASE_USER_TYPE_PERMISSIONS;
    return await util.httpCall("GET", token, url);    
};

methods.editUserType = async (data, token) => {
    const url = constants.ASE_EDIT_USER_TYPE;
    return await util.httpCall("PUT", token, url, JSON.stringify(data));    
};


module.exports = methods;
const util = require("../../utils/util");
const constants = require("../../utils/constants");
const log4js = require("log4js");
const logger = log4js.getLogger("jiraService");

var methods = {};

methods.jiraValidateToken = async (token) => {
	const url = constants.JIRA_PING_API;
    return await util.httpJiraCall("GET", token, url, undefined); 
};

methods.createTickets = async (issues, imConfig) => {
    var output = {};
    var success = [];
    var failures = [];

    for (var i=0; i<issues.length; i++){
        const imPayload = await createPayload(issues[i], imConfig);

        try {
            const result = await util.httpJiraCall("POST", imConfig.imaccesstoken, imConfig.imurl+constants.JIRA_CREATE_TICKET, imPayload); 
            if (result.code === 201){
                const imTikcket = imConfig.imurl+"/browse/"+result.data.key;
                success.push({issueId: issues[i]["issueId"], ticket: imTikcket});
            }
            else {
                failures.push({issueId: issues[i]["issueId"], errorCode: result.code, errorMsg: result.data});
                logger.error(`Failed to create ticket for issue Id ${issues[i]["issueId"]} and the error is ${result.data}`);
            }
        } catch (error) {
            logger.error(`Failed to create ticket for issue Id ${issues[i]["issueId"]} and the error is ${error}`);
            failures.push({issueId: issues[i]["issueId"], errorMsg: error.message});
        }
    }
    output["success"]=success;
    output["failure"]=failures;
    return output;
};

createPayload = async (issue, imConfig) => {
    var payload = {};
    var attrMap = {};
    attrMap["project"] = {"key" : imConfig.improjectkey};
    attrMap["issuetype"] = {"name" : imConfig.imissuetype};
    attrMap["priority"] = {"name" : imConfig.severitymap[issue["Severity"]]};
    attrMap["summary"] = "Security issue: "+issue["Issue Type"].replaceAll("&#40;", "(").replaceAll("&#41;", ")") + " found by AppScan";
    attrMap["description"] = JSON.stringify(issue, null, 4);

    const attributeMappings = typeof imConfig.attributeMappings != 'undefined' ? imConfig.attributeMappings : [];

    for(var i=0; i<attributeMappings.length; i++) {
        if(attributeMappings[i].type === 'Array')
            attrMap[attributeMappings[i].imAttr] = [issue[attributeMappings[i].appScanAttr]];
        else
            attrMap[attributeMappings[i].imAttr] = issue[attributeMappings[i].appScanAttr];    
    }

    payload["fields"] = attrMap;
    return payload;
}


module.exports = methods;

const jobService = require("../../ase/service/jobService");
const jiraService = require("../services/jiraService");
const authService = require('../../ase/service/authService');
const issueService = require('../../ase/service/issueService');
var fs = require('fs').promises;
var methods = {};
const constants = require("../../utils/constants");
const log4js = require("log4js");
const logger = log4js.getLogger("igwService");


methods.aseLogin = async () => {
    var inputData = {};
    inputData["keyId"]=process.env.keyId;
    inputData["keySecret"] = process.env.keySecret;
    const result = await authService.keyLogin(inputData);
    return result.data.sessionId;    
}

methods.getCompletedScans = async (syncInterval, aseToken) => {
    var date = new Date();
    date.setDate(date.getDate() - syncInterval);
    const fDate = date.toISOString().slice(0, 10);

    date = new Date();
    date.setDate(date.getDate() - 1);
    const tDate = date.toISOString().slice(0, 10);

    const queryString = "LastRanBetweenFromAndTodate="+fDate+"|"+tDate+",JobType=2";
    logger.info(`Fetching scans completed between ${fDate} and ${tDate}`);
    return await jobService.searchJobs(queryString, aseToken);
}

methods.getIMConfig = async (providerId) => {

    const imFilePath = './config/'+providerId+'.json';
    
    if (require('fs').existsSync(imFilePath))
        return await fs.readFile(imFilePath, 'utf8'); 
}

methods.filterIssues = async (issues, applicationId, imConfig, token) => {
    const issueStates = imConfig.issuestates;
    const issueSeverities = imConfig.issueseverities;

    var issueStatesArray = [];
    var issueSeveritiesArray = [];
    
    if(issueStates) issueStatesArray = issueStates.split(",");
    if(issueSeverities) issueSeveritiesArray = issueSeverities.split(",");   
    
    var stateFilteredIssues = [];
    if (issueStatesArray.length > 0) stateFilteredIssues = issues.filter(issue => issueStatesArray.includes(issue["issue-status"]));
        
    var severityFilteredIssues = [];
    if (issueSeveritiesArray.length > 0) severityFilteredIssues = stateFilteredIssues.filter(issue => issueSeveritiesArray.includes(issue["issue-severity"]));
    
    var filteredIssues = [];
    for(var i=0; i<severityFilteredIssues.length; i++) {
        var issue = severityFilteredIssues[i];
        const issueResults = await issueService.getIssueDetails(applicationId, issue["issue-id"], token);
        if (issueResults.code === 200) {
            var issueDetails = issueResults.data;
            if (typeof(issueDetails["External ID"])==='undefined' || issueDetails["External ID"].length === 0){
                if(issue["reasoning"]) issueDetails["reasoning"] = issue["reasoning"];
                if(issue["original-http-traffic"]) issueDetails["original-http-traffic"] = issue["original-http-traffic"];  
                if(issue["test-http-traffic"]) issueDetails["test-http-traffic"] = issue["test-http-traffic"];  
                filteredIssues.push(issueDetails);
            }
        }   
    }

    const maxIssues = imConfig.maxissues;
    return filteredIssues.slice(0,maxIssues);
}

methods.createImTickets = async (filteredIssues, imConfig) => {
    var result;
    if(imConfig.providerId === constants.DTS_JIRA) 
        result = await jiraService.createTickets(filteredIssues, imConfig);
    //console.log(JSON.stringify(result, null, 4));
    return result;
}

module.exports = methods;

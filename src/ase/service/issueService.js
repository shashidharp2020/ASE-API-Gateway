const util = require("../../utils/util");
const constants = require("../../utils/constants");
const databaseconn = require("../../../databaseconn");
const jobService = require("./jobService");
const sql = require('msnodesqlv8');
const log4js = require("log4js");
const logger = log4js.getLogger("issueService");

var methods = {};


methods.getIssuesOfJobThroughReports = async (jobId, token, traffic) => {

    try {
        const reportpacksResult = await jobService.getReportPacks(jobId, token);
        var reportpacks;
        if(reportpacksResult.code === 200)
            reportpacks = reportpacksResult.data;
        var reportPackId = (reportpacks) ? reportpacks[0].reportPackId : undefined;
        if(!reportPackId) {
            logger.error("No reportpacks available for jobId "+jobId);
            return; 
        }
        
        const reportsResult = await jobService.getReportsInReportPack(reportPackId, token);
        var reportsObj; 
        if (reportsResult.code === 200)
            reportsObj = reportsResult.data;

        if(!reportsObj.reports.report) {
            logger.error("No reports available for reportpack id "+reportPackId);
            return;
        }

        var reportId;
        reportsObj.reports.report.forEach(report => {
            if (report.name === "Security Issues") reportId = report.id;
        })

        if(!reportId) {
            logger.error("Security Issues report is not available.")
            return;
        }

        const issuesResult = await jobService.getIssuesOfReport(reportId, token);
        const issues = (!issuesResult.data["wf-security-issues"]) ? [] : issuesResult.data["wf-security-issues"].issue;
        for(var i=0; i<issues.length; i++) {
            var element  = issues[i];
            element["issue-id"] = element["issue-id"].content;
            if (traffic===true || traffic==='true'){
                const issueTraffic = await jobService.getIssueTrafficData(reportId, element["issue-id"], token);
                try {
                    if (issueTraffic.data["security-issue"]["issue-details"].variants.variant.reasoning["validation-infos"]["validation-info"][0])
                        element["reasoning"] = issueTraffic.data["security-issue"]["issue-details"].variants.variant.reasoning["validation-infos"]["validation-info"][0].content;
                } catch (error) {
                    //print nothing
                }

                try {
                    if (issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["original-http-traffic"].content)
                    element["original-http-traffic"] = issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["original-http-traffic"].content;
                } catch (error) {
                    //print nothing
                }

                try {
                    if (issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["test-http-traffic"].content)
                    element["test-http-traffic"] = issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["test-http-traffic"].content;
                } catch(error) {
                    //print nothing
                }
            }
        }

        return issues;
    }
    catch(error) {
        logger.error("Failed to get issues of Job: " + error);
        return; 
    }
}

methods.getIssuesOfJob = async (jobId) => {

const query = "SELECT i.issueId, "+
"CASE WHEN i.Status=1 then 'Open' "+
"WHEN i.Status=2 then 'InProgress' "+
"WHEN i.Status=3 then 'Reopened' "+
"WHEN i.Status=4 then 'Noise' "+
"WHEN i.Status=5 then 'Passed' "+
"WHEN i.Status=6 then 'Fixed' "+
"WHEN i.Status=7 then 'New' "+
"END as Status, "+
"CASE WHEN i.Severity=100 then 'Information' "+
"WHEN i.Severity=200 then 'Low' "+
"WHEN i.Severity=300 then 'Medium' "+
"WHEN i.Severity=400 then 'High' "+
"WHEN i.Severity=500 then 'Critical' "+
"END as Severity, "+
"ls.StringValue as IssueType, convert(VARCHAR(20),i.DateCreated,120) as DateCreated, convert(VARCHAR(20),i.LastUpdated,120) as LastUpdated, i.Location "+
"FROM issue i, JobIssueRef jir, LocalizedString ls, IssueType it WHERE i.IssueId=jir.IssueId AND jir.JobId="+jobId+
" AND ls.CultureId=51 and i.IssueTypeId=it.IssueTypeId AND it.DisplayName=ls.Name and i.status!=4 and i.status!=5";

return new Promise((resolve, reject) => {
    sql.query(databaseconn.config, query, (err, rows) => {
        if(err) reject(err);
        else resolve(rows);
       });
    });
};

methods.getIssuesOfApplication = async (appId, token) => {
    const appDetails = await methods.getApplicationDetails(appId, token);
    const url = constants.ASE_ISSUES_APPLICATION.replace("{APPNAME}", appDetails.data.name);
    return await util.httpCall("GET", token, url);
};

methods.getApplicationDetails = async (appId, token) => {
    const url = constants.ASE_APPLICATION_DETAILS.replace("{APPID}", appId);
    return await util.httpCall("GET", token, url);
};


methods.getIssueDetails = async (appId, issueId, token) => {
    const url = constants.ASE_ISSUE_DETAILS.replace("{APPID}", appId).replace("{ISSUEID}", issueId);
    var result = await util.httpCall("GET", token, url);
    var issue = result.data;
    if(result.code === 200){
        var attributesArray = (issue.attributeCollection.attributeArray) ? (issue.attributeCollection.attributeArray) : [];
        var attribute = {};
        for(var i=0; i<attributesArray.length; i++){
            if((attributesArray[i].value).length > 0)
                attribute[attributesArray[i].name] = (attributesArray[i].value)[0];
        }   
        delete issue["attributeCollection"];
        result.data = Object.assign(issue, attribute);
    }

    return result;
}

methods.updateIssue = async (issueId, data, token, eTag) => {
    const url = constants.ASE_UPDATE_ISSUE.replace("{ISSUEID}", issueId);
    return await util.httpCall("PUT", token, url, JSON.stringify(data), eTag);
}

methods.getHTMLIssueDetails = async(appId, issueId, downloadPath, token) => {
    const url = constants.ASE_GET_HTML_ISSUE_DETAILS.replace("{ISSUEID}", issueId).replace("{APPID}", appId);
    return await util.downloadFile(url, downloadPath, token);
}


module.exports = methods;

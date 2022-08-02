const util = require("../../utils/util");
const constants = require("../../utils/constants");
const databaseconn = require("../../../databaseconn");
const sql = require('msnodesqlv8');

var methods = {};

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


module.exports = methods;

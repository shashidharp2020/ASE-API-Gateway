const util = require("../../utils/util");
const constants = require("../../utils/constants");
const databaseconn = require("../../../databaseconn");
const sql = require('msnodesqlv8');

var methods = {};

methods.createScanJob = async (scanData, token) => {
    var createScanData = {};
    createScanData["testPolicyId"]  = scanData.testPolicyId;
    createScanData["folderId"]      = scanData.folderId;
    createScanData["name"]          = scanData.name;
    if (scanData.description) createScanData["description"] = scanData.description;
    if (scanData.contact) createScanData["contact"] = scanData.contact;
    if (scanData.applicationId) createScanData["applicationId"] = scanData.applicationId;
    const url = constants.ASE_CREATE_SCAN.replace("{TEMPLATEID}", scanData.templateId);
    return await util.httpCall("POST", token, url, JSON.stringify(createScanData));
};


methods.editScanJob = async (inputData, jobId, token, etag) => {
    const url = constants.ASE_EDIT_SCAN.replace("{JOBID}", jobId);
    return await util.httpCall("PUT", token, url, JSON.stringify(inputData), etag);
};

methods.updateScanConfiguration = async (jobId, key, value, doEncrypt, token) => {
    var updateScanData = {};
    const url = constants.ASE_UPDATE_SCAN.replace("{JOBID}", jobId);
    updateScanData["scantNodeXpath"]  = key;
    updateScanData["scantNodeNewValue"]  = value;
    if(doEncrypt) updateScanData["encryptNodeValue"]  = true;
    return await util.httpCall("POST", token, url, JSON.stringify(updateScanData));
};

methods.updateScanType = async (jobId, scantypeId, token) => {
    const url = constants.ASE_UPDATE_SCAN_TYPE.replace("{JOBID}", jobId).replace("{SCANTYPEID}", scantypeId);
    return await util.httpCall("PUT", token, url);
};

methods.associateAgentServer = async (jobId, agentServerId, token) => {
    const url = constants.ASE_DESIGNATE_AGENT_SERVER.replace("{JOBID}", jobId).replace("{SERVERID}", agentServerId);
    return await util.httpCall("POST", token, url, "");
};

methods.updateAdditionalDomains = async (jobId, additionalDomains, token) => {
    const url = constants.ASE_ADDIONAL_DOMAINS.replace("{JOBID}", jobId);
    var data = {};
    data["domainsList"] = additionalDomains;
    return await util.httpCall("POST", token, url, JSON.stringify(data));
};

methods.updateAlertSubscription = async (jobId, alertSubscription, token) => {
    const url = constants.ASE_ALERT_SUBSCRIPTION.replace("{JOBID}", jobId);
    return await util.httpCall("POST", token, url, JSON.stringify(alertSubscription));
};

methods.updateScanSchedule = async (jobId, scanSchedule, token) => {
    const url = constants.ASE_SCAN_SCHEDULE.replace("{JOBID}", jobId);
    return await util.httpCall("POST", token, url, JSON.stringify(scanSchedule));
};


methods.addFile = async (jobId, filePath, fileName, token, action) => {
    const url = constants.ASE_FILE_UPLOAD.replace("{JOBID}", jobId).replace("{ACTION}", action);
    return await util.httpFileUpload(token, url, filePath, fileName);
};

methods.runScanJob = async (jobId, etag, token) => {
    const url = constants.ASE_SCAN_RUN.replace("{JOBID}", jobId);
    return await util.httpCall("POST", token, url, JSON.stringify({"type": "run"}), etag);
};

methods.getScanJobDetails = async (jobId, token) => {
    const url = constants.ASE_SCAN_DETAILS.replace("{JOBID}", jobId);
    return await util.httpCall("GET", token, url);
};

methods.getReportPacks = async (jobId, token) => {
    const url = constants.ASE_SCAN_REPORTPACKS.replace("{JOBID}", jobId);
    return await util.httpCall("GET", token, url);
};

methods.getReportsInReportPack = async (reportpackId, token) => {
    const url = constants.ASE_REPORTPACK_REPORTS.replace("{REPORTPACKID}", reportpackId);
    return await util.httpCall("GET", token, url);
};

methods.getIssuesOfReport = async (reportId, token) => {
    const url = constants.ASE_REPORT_ISSUES.replace("{REPORTID}", reportId);
    return await util.httpCall("GET", token, url);
};

methods.getIssueTrafficData = async (reportId, issueId, token) => {
    const url = constants.ASE_REPORT_TRAFFIC_ISSUES.replace("{REPORTID}", reportId).replace("{ISSUEID}", issueId);
    return await util.httpCall("GET", token, url);    
};

methods.getJobDetails = async (jobId, token) => {
    const url = constants.ASE_JOB_DETAILS.replace("{JOBID}", jobId);
    return await util.httpCall("GET", token, url);    
};

methods.getAdditionalDomains = async (jobId, token) => {
    const url = constants.ASE_JOB_ADDITIONAL_DOMAINS.replace("{JOBID}", jobId);
    return await util.httpCall("GET", token, url);    
};

methods.getJobSchedule = async (jobId, token) => {
    const url = constants.ASE_JOB_SCHEDULE.replace("{JOBID}", jobId);
    return await util.httpCall("GET", token, url);    
};

methods.getJobAlert = async (jobId, token) => {
    const url = constants.ASE_JOB_ALERT.replace("{JOBID}", jobId);
    return await util.httpCall("GET", token, url);    
};

methods.getJobStats = async (jobId, token) => {
    const url = constants.ASE_JOB_STATISTICS.replace("{JOBID}", jobId);
    return await util.httpCall("GET", token, url);    
};

methods.getAssociatedServerId = async (jobId) => {

    const query = "SELECT DesignatedServerId AS serverId FROM folderitem WHERE folderitemid="+jobId;
    
    return new Promise((resolve, reject) => {
        sql.query(databaseconn.config, query, (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
           });
        });
};


methods.getJobStartingURL = async (jobId) => {

    const query = "select Content as strtURL from FolderItemOption_"+jobId+"_D where optionType=2013";
    
    return new Promise((resolve, reject) => {
        sql.query(databaseconn.config, query, (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
           });
        });
};


methods.deleteJob = async (jobId, token) => {
    const url = constants.ASE_JOB_DELETE.replace("{JOBID}", jobId);
    return await util.httpCall("DELETE", token, url);    
};


methods.changeJobStatus = async (jobId, jobStatusId, token) => {
    const url = constants.ASE_JOB_CHANGE_STATUS.replace("{JOBID}", jobId);
    return await util.httpCall("POST", token, url, jobStatusId+1+"");    
};

methods.searchJobs = async (queryString, token) => {
    const url = constants.ASE_JOB_SEARCH+"?queryString="+queryString;
    return await util.httpCall("GET", token, url);    
};

module.exports = methods;

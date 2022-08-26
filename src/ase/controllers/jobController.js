const log4js = require("log4js");
const logger = log4js.getLogger("jobController");
const jobService = require("../service/jobService");
const applicationService = require("../service/applicationService");
const multiparty = require("multiparty");


var methods = {};

methods.createJob = async (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, async function (err, fields, files) {
        var scanInputData;
        var output = {};
        var errors = {};

        try {
            scanInputData = JSON.parse(fields.data);
        }
        catch(error) {
            logger.info("Invalid JSON data.");
            return res.status(400).send("Invalid JSON data.");
        }
        
        scanInputData["token"] = req.token;

        if (files.traffic){
            scanInputData["trafficFilePath"]= files.traffic[0].path + "";
            scanInputData["trafficFileName"] = files.traffic[0].originalFilename;
        }
        if (files.login) {
            scanInputData["loginFilePath"] = files.login[0].path + "";
            scanInputData["loginFileName"] = files.login[0].originalFilename
        }

        const isApplicationCreated = await createApplication(scanInputData, output, errors);
        const result = await createScanJob(scanInputData);
        if(result.code < 200 || result.code > 299) {
            if(isApplicationCreated === true) await deleteApplication(scanInputData);
            return res.status(result.code).send(result.data);
        }
        else
            if (typeof result.data != 'undefined') output = result.data;

        await getReportPacks(scanInputData, output, errors);
        await updateScanJobConfiguration(scanInputData, output, errors);
        await runScan(scanInputData, output, errors);

        output["errors"] = errors;
        res.status(200).json(output);
	});
}

const createScanJob = async (scanInputData) => {
    try {
        var result = await jobService.createScanJob(scanInputData, scanInputData.token)
        //output[""] = result.data;
        scanInputData["jobId"] = result.data.id;
        logger.info("createJob - " + JSON.stringify(result));
        return result;
    }
    catch (error) {
        logger.error("createJob - "+ JSON.stringify(error));
        return error;
    }
}

const deleteApplication = async (scanInputData) => {
    try {
        await applicationService.deleteApplicaiton(scanInputData.applicationId, scanInputData.token);
        logger.info("Deleted the applicaiton of Id "+scanInputData.applicationId);
    }
    catch(e) {
        logger.error("Failed to delete the application of Id "+ scanInputData.applicationId);
    }
}

const getReportPacks = async (scanInputData, output, errors) => {
    try {
        const result = await jobService.getReportPacks(scanInputData.jobId, scanInputData.token);
        if (result.code >=200 && result.code <=299) output["reportPacks"] = result.data;
        logger.info("Report Packs : "+ JSON.stringify(result));
    }
    catch(error) {
        logger.error("Failed to retrieve reportpacks of scan job : " + JSON.stringify(error));
        errors["reportPacks"] = error.code + ": Failed to retrieve report packs. " + error.data ? error.data : "";
    }
}

const runScan = async (scanInputData, output, errors) => {
    if (scanInputData.run && scanInputData.run===true) {
        try{
            const jobDetails = await jobService.getScanJobDetails(scanInputData.jobId, scanInputData.token);
            logger.info("Scan details : "+ JSON.stringify(jobDetails));
            const runStatus = await jobService.runScanJob(scanInputData.jobId, jobDetails.data.etag, scanInputData.token);
            if (runStatus.code >=200 && runStatus.code <=299) output["run"] = "Started the scan job.";
            logger.info("Scan start status : " + JSON.stringify(runStatus));
        }
        catch(error){
            logger.error("Failed to start the scan job : " + JSON.stringify(error));
            errors["run"] = error.code + ": Failed to start the scan job. " + error.data ? error.data : "";
        }
    }
}

const createApplication = async (scanInputData, output, errors) => {
    if(!(!scanInputData.applicationId && scanInputData.createApplication && scanInputData.createApplication==true)) return false;

    try {
        var result = await applicationService.createApplication({"name": scanInputData.name+"_"+scanInputData.folderId}, scanInputData.token);
        if (result.code >=200 && result.code <=299) output["application"] = result.data;
        logger.info("Status of create application - " + JSON.stringify(result));
        scanInputData["applicationId"] = result.data.id;
        return true;
    }
    catch(error) {
        logger.error("Create application - " + JSON.stringify(error));
        errors["application"] = error.code + ": Failed to create an application. " + error.data ? error.data : "";
        return false;
    }    
}

const updateScanJobConfiguration = async (scanInputData, output, errors) => {
    const jobId = scanInputData.jobId;
    const token = scanInputData.token;

    if (scanInputData.StartingUrl && scanInputData.StartingUrl.length > 0) {
        try {
            var result = await jobService.updateScanConfiguration(jobId, "StartingUrl", scanInputData.StartingUrl, false, token);
            if (result.code >=200 && result.code <=299) output["StartingUrl"] = scanInputData.StartingUrl;
            logger.info("Status of update Job with the starting URL - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the starting URL - " + JSON.stringify(error));
            errors["StartingUrl"] = error.code + ": Failed to add the Starting URL. " + error.data ? error.data : "";
        }
    }

    //Manual, Automatic, None
    if (scanInputData.LoginMethod && scanInputData.LoginMethod.length > 0) {
        try {
            var result = await jobService.updateScanConfiguration(jobId, "LoginMethod", scanInputData.LoginMethod, false, token);
            if (result.code >=200 && result.code <=299) output["LoginMethod"] = scanInputData.LoginMethod;
            logger.info("Status of update Job with the LoginMethod - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the TestOptimization - " + JSON.stringify(error));
            errors["TestOptimization"] = error.code + ": Failed to update the LoginMethod. " + error.data ? error.data : "";
        }
    }

    if (scanInputData.LoginUsername && scanInputData.LoginUsername.length > 0) {
        try {
            var result = await jobService.updateScanConfiguration(jobId, "LoginUsername", scanInputData.LoginUsername, false, token);
            if (result.code >=200 && result.code <=299) output["LoginUsername"] = scanInputData.LoginUsername;
            logger.info("Status of update Job with the LoginUsername - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the LoginUsername - " + JSON.stringify(error));
            errors["LoginUsername"] = error.code + ": Failed to update the LoginUsername. " + error.data ? error.data : "";
        }
    }

    if (scanInputData.LoginPassword && scanInputData.LoginPassword.length > 0) {
        try {
            var result = await jobService.updateScanConfiguration(jobId, "LoginPassword", scanInputData.LoginPassword, true, token);
            if (result.code >=200 && result.code <=299) output["LoginPassword"] = "*******************";
            logger.info("Status of update Job with the LoginPassword - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the LoginPassword - " + JSON.stringify(error));
            errors["LoginPassword"] = error.code + ": Failed to update the LoginPassword. " + error.data ? error.data : "";
        }
    }

    if (scanInputData.TestOptimization && !isNaN(scanInputData.TestOptimization) && scanInputData.TestOptimization > 0 ) {
        try {
            var result = await jobService.updateScanConfiguration(jobId, "TestOptimization", scanInputData.TestOptimization, false, token);
            if (result.code >=200 && result.code <=299) output["TestOptimization"] = scanInputData.TestOptimization;
            logger.info("Status of update Job with the TestOptimization - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the TestOptimization - " + JSON.stringify(error));
            errors["TestOptimization"] = error.code + ": Failed to update the TestOptimization. " + error.data ? error.data : "";
        }
    }

    if (scanInputData.scanTypeId && !isNaN(scanInputData.scanTypeId) && scanInputData.scanTypeId > 0 ) { 
        try {
            var result = await jobService.updateScanType(jobId, scanInputData.scanTypeId, token);
            if (result.code >=200 && result.code <=299) output["ScanTypeId"] = scanInputData.scanTypeId;
            logger.info("Status of update Job with the ScanTypeId - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the ScanTypeId - " + JSON.stringify(error));
            errors["ScanTypeId"] = error.code + ": Failed to update the ScanTypeId. " + error.data ? error.data : "";
        }
    }

    if (scanInputData.serverId && !isNaN(scanInputData.serverId) && scanInputData.serverId > 0) {
        try {
            var result = await jobService.associateAgentServer(jobId, scanInputData.serverId, token);
            if (result.code >=200 && result.code <=299) output["serverId"] = scanInputData.serverId;
            logger.info("Status of update Job with the serverId - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the serverId - " + JSON.stringify(error));
            errors["serverId"] = error.code + ": Failed to update the serverId. " + error.data ? error.data : "";
        }
    }

    if (scanInputData.additionalDomains && scanInputData.additionalDomains.length > 0) {
        try {
            var result = await jobService.updateAdditionalDomains(jobId, scanInputData.additionalDomains, token);
            if (result.code >=200 && result.code <=299) output["additionalDomains"] = scanInputData.additionalDomains;
            logger.info("Status of update Job with the additionalDomains - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the additionalDomains - " + JSON.stringify(error));
            errors["additionalDomains"] = error.code + ": Failed to update the additionalDomains. " + error.data ? error.data : "";
        }
    }

    if (scanInputData.alertSubscription) {
        try {
            var result = await jobService.updateAlertSubscription(jobId, scanInputData.alertSubscription, token);
            if (result.code >=200 && result.code <=299) output["alertSubscription"] = scanInputData.alertSubscription;
            logger.info("Status of update Job with the alertSubscription - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the alertSubscription - " + JSON.stringify(error));
            errors["alertSubscription"] = error.code + ": Failed to update the alertSubscription. " + error.data ? error.data : "";
        }
    } 
    
    if (scanInputData.scanSchedule && typeof(scanInputData.scanSchedule.enableSchedule) != 'undefined') {
        try {
            var result = await jobService.updateScanSchedule(jobId, scanInputData.scanSchedule, token);
            if (result.code >=200 && result.code <=299) output["scanSchedule"] = scanInputData.scanSchedule;
            logger.info("Status of update Job with the scanSchedule - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the scanSchedule - " + JSON.stringify(error));
            errors["scanSchedule"] = error.code + ": Failed to update the scanSchedule. " + error.data ? error.data : "";
        }
    }     

    if (scanInputData.loginFilePath && scanInputData.loginFilePath.length > 0) {
        try {
            var result = await jobService.addFile(jobId, scanInputData.loginFilePath, scanInputData.loginFileName, token, "login");
            if (result.code >=200 && result.code <=299) output["login"] = "Login file added.";
            logger.info("Status of update Job with the login file - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the login file - " + JSON.stringify(error));
            errors["login"] = error.code + ": Failed to update the login file. " + error.data ? error.data : "";
        }
    }
    
    if (scanInputData.trafficFilePath && scanInputData.trafficFilePath.length > 0) {
        try {
            var result = await jobService.addFile(jobId, scanInputData.trafficFilePath, scanInputData.trafficFileName, token, "add");
            if (result.code >=200 && result.code <=299) output["traffic"] = "Traffic file added.";
            logger.info("Status of update Job with the traffic file - " + JSON.stringify(result));
        }
        catch(error) {
            logger.error("updateJob with the traffic file - " + JSON.stringify(error));
            errors["traffic"] = error.code + ": Failed to update the traffic file. " + error.data ? error.data : "";
        }
    }
}

methods.getReportPackForJobId = async (req, res) => {
    try {
        const result = await jobService.getReportPacks(req.params.jobId, req.token);
        res.status(result.code).json(result.data);
    }
    catch (error) {
        logger.error("Failed to get reportpacks for job Id "+req.params.jobId + ": "+error);
        return res.status(500).send("Failed to get reportpacks for job");
    }
}

methods.getReportsInReportPack = async (req, res) => {
    try {
        const result = await jobService.getReportsInReportPack(req.params.reportpackId, req.token);
        var reports = [];
        if (result.data.reports.report) {
            result.data.reports.report.forEach(element => {
                var report = {};
                report["name"] = element.name;
                report["id"] = element.id;
                reports.push(report);
            })
        }
        res.status(result.code).json(reports);
    }
    catch (error) {
        logger.error("Failed to get reportpacks for job Id "+req.params.jobId + ": "+error);
        return res.status(500).send("Failed to get reportpacks for job");
    }
}


methods.getJobDetails = async (req, res) => {
    try {
        const result = await jobService.getJobDetails(req.params.jobId, req.token);
        
        const rpResult = await jobService.getReportPacks(req.params.jobId, req.token);
        if (rpResult.code >=200 && rpResult.code <=299) result.data["reportPacks"] = rpResult.data;

        const addDomainsResult = await jobService.getAdditionalDomains(req.params.jobId, req.token);
        if (addDomainsResult.code >=200 && addDomainsResult.code <=299) result.data["additionalDomains"] = addDomainsResult.data;

        const jobScheduleResult = await jobService.getJobSchedule(req.params.jobId, req.token);
        if (jobScheduleResult.code >=200 && jobScheduleResult.code <=299 && jobScheduleResult.data["scan-schedule"]) result.data["scanSchedule"] = jobScheduleResult.data["scan-schedule"];

        const jobAlert = await jobService.getJobAlert(req.params.jobId, req.token);
        if (jobAlert.code >=200 && jobAlert.code <=299) result.data["alertSubscription"] = jobAlert.data;

        const jobStatsResult = await jobService.getJobStats(req.params.jobId, req.token);
        if (jobStatsResult.code >=200 && jobStatsResult.code <=299 && jobStatsResult.data.statistics) result.data["statistics"] = jobStatsResult.data.statistics;

        try {
            const associatedServer = await jobService.getAssociatedServerId(req.params.jobId);
            if (associatedServer[0].serverId)
                result.data["serverId"] = associatedServer[0].serverId;
        }
        catch(error) {
            logger.error("Failed to get assoicated serverId for Job "+req.params.jobId + ": "+error);
        }

        try {
            const strtURLObj = await jobService.getJobStartingURL(req.params.jobId);
            if (strtURLObj[0].strtURL)
                result.data["StartingUrl"] = strtURLObj[0].strtURL;
        }
        catch(error) {
            logger.error("Failed to get starting URL of a Job "+req.params.jobId + ": "+error);
        }        

        res.status(result.code).json(result.data);
    }
    catch (error) {
        logger.error("Failed to get job Information "+req.params.jobId + ": "+error);
        return res.status(500).send("Failed to get job Information");        
    }
}


methods.editJob = async (req, res) => {
	var form = new multiparty.Form();
	form.parse(req, async function (err, fields, files) {
        var scanInputData;
        var output = {};
        var errors = {};

        try {
            scanInputData = JSON.parse(fields.data);
        }
        catch(error) {
            logger.info("Invalid JSON data.");
            return res.status(400).send("Invalid JSON data.");
        }
        
        scanInputData["token"] = req.token;

        if (files.traffic){
            scanInputData["trafficFilePath"]= files.traffic[0].path + "";
            scanInputData["trafficFileName"] = files.traffic[0].originalFilename;
        }
        if (files.login) {
            scanInputData["loginFilePath"] = files.login[0].path + "";
            scanInputData["loginFileName"] = files.login[0].originalFilename
        }

        scanInputData["jobId"] = req.params.jobId;
        const result = await editScanJob(scanInputData, req.params.jobId, req.token);
        if(result.code < 200 || result.code > 299) return res.status(result.code).send(result.data);

        await getReportPacks(scanInputData, output, errors);
        await updateScanJobConfiguration(scanInputData, output, errors);
        await runScan(scanInputData, output, errors);

        output["errors"] = errors;
        res.status(200).json(output);
	});
}

const editScanJob = async(scanInputData, jobId, token) => {

    try {
        if (scanInputData["testPolicyId"] || scanInputData["applicationId"] || scanInputData["folderId"] || scanInputData["name"] || scanInputData["description"] || scanInputData["contact"]){
            const result = await jobService.getJobDetails(jobId, token);
            if(result.code < 200 || result.code > 299) return res.status(result.code).send(result.data);
            const existingData = result.data;
            var inputData = {};
            inputData["testPolicyId"] = scanInputData["testPolicyId"] ? scanInputData["testPolicyId"] : existingData["testPolicyId"];
            inputData["applicationId"] = scanInputData["applicationId"] ? scanInputData["applicationId"] : existingData["applicationId"];
            inputData["folderId"] = scanInputData["folderId"] ? scanInputData["folderId"] : existingData["folderId"];
            inputData["name"] = scanInputData["name"] ? scanInputData["name"] : existingData["name"];
            inputData["description"] = scanInputData["description"] ? scanInputData["description"] : existingData["description"];
            inputData["contact"] = scanInputData["contact"] ? scanInputData["contact"] : existingData["contact"];
            return await jobService.editScanJob(inputData, jobId, token, existingData["etag"]);
        }
    }
    catch (error) {
        logger.error("Failed to edit the scan job "+jobId + ": "+error);
        return res.status(500).send("Failed to edit the scan job Information"); 
    }
}


methods.deleteJob = async (req, res) => {
    try {
        if (req.query.reportpacks && req.query.reportpacks=='true'){
            const reportPacksResult = await jobService.getReportPacks(req.params.jobId, req.token);
            reportPacksResult.data.forEach(element => {
                jobService.deleteJob(element.reportPackId, req.token);
            })
        }

        const result = await jobService.deleteJob(req.params.jobId, req.token);
        res.status(result.code).json(result.data);
    }
    catch (error) {
        logger.error("Failed to delete job Id "+req.params.jobId + ": "+error);
        return res.status(500).send("Failed to delete job");
    }
}

methods.actionOnJob = async (req, res) => {
    try {
        const actionId = parseInt(req.params.actionId);
        const result = await jobService.changeJobStatus(req.params.jobId, actionId, req.token);
        res.status(result.code).json(result.data);
    }
    catch(error) {
        logger.error("Failed to change the status of a scan job Id "+req.params.jobId + ": "+JSON.stringify(error));
        return res.status(500).send("Failed to change the status of a scan job");
    }
}

methods.jobsSearch = async (req, res) => {
    try {
        const queryString = req.query.queryString;
        const result = await jobService.searchJobs(queryString, req.token);
        res.status(result.code).json(result.data);
    }
    catch(error) {
        logger.error("Failed to search scan jobs: "+JSON.stringify(error));
        return res.status(500).send("Failed to search scan jobs");
    }
};
module.exports = methods;

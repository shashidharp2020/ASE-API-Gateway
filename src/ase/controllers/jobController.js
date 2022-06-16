const log4js = require("log4js");
const logger = log4js.getLogger("jobController");
const jobService = require("../service/jobService");
const applicationService = require("../service/applicationService");
const multiparty = require("multiparty");


var methods = {};

methods.createJob = async (req, res) => {

	var form = new multiparty.Form();
	form.parse(req, async function (err, fields, files) {
        var scanInputData = JSON.parse(fields.data);
        scanInputData["token"] = req.token;
        if (files.traffic){
            scanInputData["trafficFilePath"]= files.traffic[0].path + "";
            scanInputData["trafficFileName"] = files.traffic[0].originalFilename;
        }
        if (files.login) {
            scanInputData["loginFilePath"] = files.login[0].path + "";
            scanInputData["loginFileName"] = files.login[0].originalFilename
        }
        var output = {};
        var errors = {};

        const isApplicationCreated = await createApplication(scanInputData, output, errors);
        const result = await createScanJob(scanInputData, output);
        if(result.code < 200 || result.code > 299) {
            if(isApplicationCreated === true) await deleteApplication(scanInputData);
            return res.status(result.code).send(result.code);
        }
        await getReportPacks(scanInputData, output, errors);
        await updateScanJobConfiguration(scanInputData, output, errors);
        await runScan(scanInputData, output, errors);

        output["errors"] = errors;
        res.status(200).json(output);
	});
}

const createScanJob = async (scanInputData, output) => {
    try {
        var result = await jobService.createScanJob(scanInputData, scanInputData.token)
        output = result.message;
        scanInputData["jobId"] = result.message.id;
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
        if (result.code >=200 && result.code <=299) output["reportPacks"] = result.message;
        logger.info("Report Packs : "+ JSON.stringify(result));
    }
    catch(error) {
        logger.error("Failed to retrieve reportpacks of scan job : " + JSON.stringify(error));
        errors["reportPacks"] = error.code + ": Failed to retrieve report packs. " + error.message ? error.message : "";
    }
}

const runScan = async (scanInputData, output, errors) => {
    if (scanInputData.run && scanInputData.run===true) {
        try{
            const jobDetails = await jobService.getScanJobDetails(scanInputData.jobId, scanInputData.token);
            logger.info("Scan details : "+ JSON.stringify(jobDetails));
            const runStatus = await jobService.runScanJob(scanInputData.jobId, jobDetails.message.etag, scanInputData.token);
            if (runStatus.code >=200 && runStatus.code <=299) output["run"] = "Started the scan job.";
            logger.info("Scan start status : " + JSON.stringify(runStatus));
        }
        catch(error){
            logger.error("Failed to start the scan job : " + JSON.stringify(error));
            errors["run"] = error.code + ": Failed to start the scan job. " + error.message ? error.message : "";
        }
    }
}

const createApplication = async (scanInputData, output, errors) => {
    if(!(!scanInputData.applicationId && scanInputData.createApplication && scanInputData.createApplication==true)) return false;

    try {
        var result = await applicationService.createApplication({"name": scanInputData.name+"_"+scanInputData.folderId}, scanInputData.token);
        if (result.code >=200 && result.code <=299) output["application"] = result.message;
        logger.info("Status of create application - " + JSON.stringify(result));
        scanInputData["applicationId"] = result.message.id;
        return true;
    }
    catch(error) {
        logger.error("Create application - " + JSON.stringify(error));
        errors["application"] = error.code + ": Failed to create an application. " + error.message ? error.message : "";
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
            errors["StartingUrl"] = error.code + ": Failed to add the Starting URL. " + error.message ? error.message : "";
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
            errors["TestOptimization"] = error.code + ": Failed to update the LoginMethod. " + error.message ? error.message : "";
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
            errors["LoginUsername"] = error.code + ": Failed to update the LoginUsername. " + error.message ? error.message : "";
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
            errors["LoginPassword"] = error.code + ": Failed to update the LoginPassword. " + error.message ? error.message : "";
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
            errors["TestOptimization"] = error.code + ": Failed to update the TestOptimization. " + error.message ? error.message : "";
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
            errors["ScanTypeId"] = error.code + ": Failed to update the ScanTypeId. " + error.message ? error.message : "";
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
            errors["serverId"] = error.code + ": Failed to update the serverId. " + error.message ? error.message : "";
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
            errors["additionalDomains"] = error.code + ": Failed to update the additionalDomains. " + error.message ? error.message : "";
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
            errors["alertSubscription"] = error.code + ": Failed to update the alertSubscription. " + error.message ? error.message : "";
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
            errors["scanSchedule"] = error.code + ": Failed to update the scanSchedule. " + error.message ? error.message : "";
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
            errors["login"] = error.code + ": Failed to update the login file. " + error.message ? error.message : "";
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
            errors["traffic"] = error.code + ": Failed to update the traffic file. " + error.message ? error.message : "";
        }
    }
}


module.exports = methods;

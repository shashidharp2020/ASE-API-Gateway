const log4js = require("log4js");
const logger = log4js.getLogger("igwController");
const jsonwebtoken = require("../../utils/jsonwebtoken");
const constants = require("../../utils/constants");
const igwService = require("../services/igwService");
const issueService = require("../../ase/service/issueService");
const imConfigService = require("../services/imConfigService");
const global = require('../../utils/global');
var crypto = require('crypto'); 
const fs = require('fs');
var CronJob = require('cron').CronJob;


var methods = {};

methods.igwLogin = async (req, res) => {
	try{
        const{adminEmail, adminPassword} = req.body;
		var passwordHash = crypto.pbkdf2Sync(adminPassword, constants.HASHING_SALT,  1000, 64, 'sha512').toString('hex');

        if (adminEmail == process.env.LOCAL_ADMIN_USER && passwordHash===process.env.ADMIN_USER_PASSWORD)
		{
            var data = {
                "adminEmail": adminEmail,
                "userRole": "Admin",
            };

            var token = jsonwebtoken.createToken(data);
            return res.status(200).json({"token" : token});
		}
        else
            return res.status(403).json({"message": constants.ERR_WRONG_CREDENTIALS});
	}
	catch(error) {
		logger.error("Login failed: "+JSON.stringify(error));
        return res.status(500).send("Login failed");
	}
};

methods.getProviders = (req, res) => {
    return res.status(200).json(constants.PROVIDERS);
}

methods.createConfig = (req, res) => {
    const providerId = req.params.providerid;
    var imFilePath ;

    if (providerId === constants.DTS_JIRA)
        imFilePath = './config/'+constants.DTS_JIRA+'.json';
    else {
        logger.error(`The specified provider ${providerId} does not exist in the system.`);
        return res.status(404).send("Provider does not exist.");
    }
        

    fs.writeFile(imFilePath, JSON.stringify(req.body, null, 4), 'utf8', function(err) {
        if (err) {
            logger.error(`Writing config file failed with error ${err}`);
            return res.status(500).json(err);
        }
        else {
            return res.status(200).send("Success");
        }
    });        
}

methods.getConfig = async (req, res) => {
    try {
        const imConfig = await imConfigService.getImConfigObject(req.params.providerid);

        if (imConfig && imConfig.length>0) return res.status(200).json(JSON.parse(imConfig));
        else {
            logger.error(`Failed to read the config for the provider ${req.params.providerId}`);
            return res.status(500).json("Check the provider Id");
        }
    }
    catch (err) {
        logger.error(`Reading the config for the provider ${req.params.providerId} failed with error ${err}`);
        return res.status(500).json(err);
    }
}

methods.startSynchronizer = async (req, res) => {
    try {
        await methods.startSync(req.params.providerid, req.params.syncinterval);
        return res.status(200).send("Started the job for provider "+ req.params.providerid);
    } catch (error) {
        logger.error(`Unable to start the synchronizer. ${error}`);
        return res.status(409).send(`Job for the provider ${req.params.providerid} already exists`);    
    }
}

methods.startSync = async (providerId, syncinterval) => {

    const jobInMap = jobsMap.get(providerId);
    if(typeof jobInMap != 'undefined')
        throw `Job for the provider ${providerId} already exists`;
        
    //var oldDateObj = new Date();
    var newDateObj = new Date();
    //newDateObj.setTime(oldDateObj.getTime() + (1 * 60 * 1000));
    var pattern = '1 '+newDateObj.getMinutes()+' '+newDateObj.getHours()+' */'+syncinterval+' * *';

    var job = new CronJob(
        pattern,
        function() {
            startCron(providerId, syncinterval);
        },
        null,
        false,
        null,
        null,
        true
    );
    
    job.start();
    jobsMap.set(providerId, job);
    logger.info("Started the job for provider "+ providerId);
}

methods.stopSync = async (req, res) => {
    const job = jobsMap.get(req.params.providerid);
    if(typeof (job) != 'undefined'){
        job.stop();
        jobsMap.delete(req.params.providerid);
        return res.status(200).send("Stopped the job of provider "+req.params.providerid);
    }
    else
        return res.status(404).send(`Job for the provider ${req.params.providerid} is not found`);
}

aseLogin = async () => {
    var aseToken;
    try {
        aseToken = await igwService.aseLogin();
        if (typeof aseToken === 'undefined') logger.error(`Failed to login to the AppScan.`);
    } catch (error) {
        logger.error(`Login to AppScan failed with the error ${error}`);
    }
    return aseToken;
}

getCompletedScans = async(period, aseToken) => {
    var completedScans;
    try {
        const result = await igwService.getCompletedScans(period, aseToken); 
        if (result.code < 200 || result.code > 299) logger.error(`Failed to fetch completed scans. ${result.data}`);
        else {
            completedScans = (result.data) ? result.data: [];
            logger.info(`Found ${completedScans.length} completed scans in the last ${period} days.`);
        }
    } catch (error) {
        logger.error(`Failed to fetch completed scans. ${error}`);
    }
    return completedScans;
}

startCron = async (providerId, syncinterval) => {
    const aseToken = await aseLogin();
    if (typeof aseToken === 'undefined') return;

    const completedScans = await getCompletedScans(syncinterval, aseToken);
    if (typeof completedScans === 'undefined') return;

    const output = [];
    try {
        for(var i=0; i<completedScans.length; i++) {
            const scan = completedScans[i];
            if (scan.applicationId){
                const issuesData = await pushIssuesOfScan(scan.id, scan.applicationId, aseToken, providerId);
                if (typeof issuesData != 'undefined') output.push(issuesData);
            } 
            else logger.info(`Scan ${scan.id} is not associated with the application. Issues of this application cannot be pushed to Issue Management System`);        
        }
        jobResults.set(providerId, output);
        logger.info(JSON.stringify(output, null, 4));        
    }
    catch(err) {
        logger.error(`Pushing issues to Issue Management System failed ${err}`);
    }
    return;
}

methods.getResults = async (req, res) => {
    const result = jobResults.get(req.params.providerid);

    if(typeof (result) != 'undefined')
        return res.status(200).json(result);
    else
        return res.status(404).send(`Results for the provider ${req.params.providerid} is not found`);
}

getIssuesOfApplication = async (applicationId, aseToken) => {
    var issues = [];
    try {
        const result = await issueService.getIssuesOfApplication(applicationId, aseToken);
        if(result.code === 200) issues = result.data;        
        else logger.error(`Failed to get issues of application ${applicationId}`);
    } catch (error) {
        logger.error(`Fetching issues of application ${applicationId} failed with error ${error}`);
    }
    return issues;
}

pushIssuesOfScan = async (scanId, applicationId, aseToken, providerId) => {
    const appIssues = await getIssuesOfApplication(applicationId, aseToken);
    const scanIssues = appIssues.filter(issue => issue["Scan Name"].replaceAll("&#40;", "(").replaceAll("&#41;", ")").includes("("+scanId+")"));
    logger.info(`${scanIssues.length} issues found in the scan ${scanId} and the scan is associated to the application ${applicationId}`);
    const pushedIssuesResult = await pushIssuesToIm(providerId, applicationId, scanIssues, aseToken);
    pushedIssuesResult["scanId"]=scanId;
    pushedIssuesResult["syncTime"]=new Date();
    return pushedIssuesResult;
}

pushIssuesOfApplication = async (applicationId, aseToken, providerId) => {
    const issues = await getIssuesOfApplication(applicationId, aseToken);
    logger.info(`${issues.length} issues found in the application ${applicationId}`);
    const pushedIssuesResult = await pushIssuesToIm(providerId, applicationId, issues, aseToken);
    pushedIssuesResult["applicationId"]=applicationId;
    pushedIssuesResult["syncTime"]=new Date();
    return pushedIssuesResult;
}

createImTickets = async (filteredIssues, imConfig, providerId) => {
    var result = [];
    try {
        result = await igwService.createImTickets(filteredIssues, imConfig, providerId);   
        if(typeof result === 'undefined' || typeof result.success === 'undefined') result = [];
    } catch (error) {
        logger.error(`Creating tickets in the ${providerId} failed with error ${error}`);
    }
    return result;
}

pushIssuesToIm = async (providerId, applicationId, issues, aseToken) => {
    var imConfig = await getIMConfig(providerId);
    if(typeof imConfig === 'undefined') return;

    const filteredIssues = await igwService.filterIssues(issues, imConfig);
    logger.info(`Issues count after filtering is ${filteredIssues.length}`);

    const imTicketsResult = await createImTickets(filteredIssues, imConfig, providerId);
    
    const successArray = (typeof imTicketsResult.success === 'undefined') ? [] : imTicketsResult.success;
    for(var j=0; j<successArray.length; j++){
        const issueObj = successArray[j];
        const issueId = issueObj.issueId;
        const imTicket = issueObj.ticket;

        try {
            await updateExternalId(applicationId, issueId, imTicket, aseToken);  
        } catch (error) {
            logger.error("Could not update the external Id of the issue for a ticket "+ error);
            issueObj["updateExternalIdError"] = error;
        }

        const downloadPath = `./temp/${applicationId}_${issueId}.zip`;
        try {
            await issueService.getHTMLIssueDetails(applicationId, issueId, downloadPath, aseToken);
        } catch (error) {
            logger.error(`Downloading HTML file having issue details failed for the issueId ${issueId} with an error ${error}`);
            issueObj["attachIssueDataFileError"] = error;
        }

        try {
            if (require("fs").existsSync(downloadPath)) await igwService.attachIssueDataFile(imTicket, downloadPath, imConfig, providerId);
        } catch (error) {
            logger.error(`Attaching data file for the issueId ${issueId} to ticket ${imTicket} failed with an error ${error}`);
            issueObj["attachIssueDataFileError"] = error;
        }

        try {
            if (require("fs").existsSync(downloadPath)) require("fs").rmSync(downloadPath);
        } catch (error) {
            logger.error(`Deleting the html data file for the issueId ${issueId} attached to ticket ${imTicket} failed with an error ${error}`);
        }
    }

    return imTicketsResult;
}

getIssueDetails = async (applicationId, issueId, aseToken) => {
    var issueData;
    try {
        const issueResults = await issueService.getIssueDetails(applicationId, issueId, aseToken);  
        if (issueResults.code === 200 && issueResults.data !=='undefined') 
            issueData = issueResults.data;
        else
            logger.error(`Fetching details of issue ${issueId} from application ${applicationId} failed with error ${issueResults.data}`);    
    } catch (error) {
        logger.error(`Fetching details of issue ${issueId} from application ${applicationId} failed with error ${error}`);
    }
    return issueData;
}

updateIssueAttribute = async (issueId, data, aseToken, etag) => {
    var updateSuccessful = false;
    try {
        const updateResult = await issueService.updateIssue(issueId, data, aseToken, etag);    
        if(updateResult.code != 200)
            logger.error(`Updating attribute of issue ${issue} failed with error ${updateResult.data}`);
        else 
            updateSuccessful = true;    
    } catch (error) {
        logger.error(`Updating attribute of issue ${issue} failed with error ${error}`);
    }
    return updateSuccessful;
}

updateExternalId = async (applicationId, issueId, ticket, aseToken) => {
    const issueData = await getIssueDetails(applicationId, issueId, aseToken);
    if (typeof issueData === 'undefined') throw `Failed to fetch the details of issue ${issueId} from application ${applicationId}`;

    var data = {};
    data["lastUpdated"] = issueData.lastUpdated;
    data["appReleaseId"] = applicationId;
    var attributeArray = [];
    var attribute = {};
    attribute["name"] = "External Id";
    attribute["value"] = [ticket];
    attributeArray.push(attribute);
    var attributeCollection = {};
    attributeCollection["attributeArray"] = attributeArray;
    data["attributeCollection"] = attributeCollection;
    const isSuccess = await updateIssueAttribute(issueId, data, aseToken, issueData.etag);
    if(!isSuccess)
        throw `Failed to update the external Id for issue ${issueId} from application ${applicationId}`;
}

getIMConfig = async (providerId) => {
    var imConfig;
    try {
        imConfig = await imConfigService.getImConfigObject(providerId);
        if(typeof imConfig === 'undefined') 
            logger.error(`Configuration does not exist for provider ${providerId}`);
        else 
            return await JSON.parse(imConfig);
    }
    catch(error) {
        logger.error(`Reading the configuration failed for the provider ${providerId} with errors ${error}`);
    }
    return imConfig;
}

module.exports = methods;

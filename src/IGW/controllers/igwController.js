const log4js = require("log4js");
const logger = log4js.getLogger("igwController");
const jsonwebtoken = require("../../utils/jsonwebtoken");
const constants = require("../../utils/constants");
const igwService = require("../services/igwService");
const jobService = require("../../ase/service/jobService");
const issueService = require("../../ase/service/issueService");
const authService = require('../../ase/service/authService');
const global = require('../../utils/global');

var crypto = require('crypto'); 
var fs = require('fs');
const { Console } = require("console");
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
        const imConfig = await igwService.getIMConfig(req.params.providerid); 

        if (imConfig && imConfig.length>0) return res.status(200).json(JSON.parse(imConfig));
        else {
            logger.error(`Failed to read the config for the provider ${req.params.providerId}`);
            return res.status(500).json("Check the provider Id");
        }
    }
    catch (err) {
        logger.error(`Reading the config for the provider ${req.params.providerId} failed with error ${error}`);
        return res.status(500).json(err);
    }
}

methods.startSync = async (req, res) => {
    const providerId = req.params.providerid;
    const jobInMap = jobsMap.get(providerId);

    if(typeof jobInMap != 'undefined')
        return res.status(409).send(`Job for the provider ${providerId} already exists`);    
    
    //var pattern = '1 1 1 */'+req.params.syncinterval+' * *';
    var pattern = '1 * * * * *';
    console.log("pattern = " + pattern);

    var job = new CronJob(
        pattern,
        function() {
            startCron(providerId, req.params.syncinterval);
        },
        null,
        false
    );
    
    job.start();
    jobsMap.set(providerId, job);

    return res.status(200).send("Started the job for provider "+ providerId);
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

startCron = async (providerId, syncinterval) => {
    var aseToken;
    try {
        aseToken = await igwService.aseLogin();
        if (aseToken === 'undefined') {
            logger.error(`Failed to login to the AppScan. Sync failed.`);
            return;
        }        
    } catch (error) {
        logger.error(`Failed to login to the AppScan. Sync failed. ${error}`);
        return;
    }

    var completedScans;
    try {
        const result = await igwService.getCompletedScans(syncinterval, aseToken); 
        completedScans = (result.data)?result.data:[];
        logger.info(`Found ${completedScans.length} completed scans in the system`);
        if (result.code != 200) {
            logger.error(`Failed to fetch completed scans.`);
            return;
        }        
    } catch (error) {
        logger.error(`Failed to fetch completed scans. ${error}`);
        return;
    }

    var output = [];
    try {
        for(var i=0; i<completedScans.length; i++) {
            const scan = completedScans[i];
            if (scan.applicationId){
                const issuesData = await methods.pushIssuesOfScan(scan.id, scan.applicationId, aseToken, providerId);
                output.push(issuesData);
            } 
            else logger.info(`Scan ${scan.id} is not associated with the application. Issues of this application cannot be pushed to Issue Management System`);        
        }
    }
    catch(err) {
        logger.error(`Pushing issues to Issue Management System failed ${err}`);
        return ;   
    }
    jobResults.set(providerId, output);
    logger.info(JSON.stringify(output, null, 4));
    return;
}

methods.getResults = async (req, res) => {
    const result = jobResults.get(req.params.providerid);

    if(typeof (result) != 'undefined')
        return res.status(200).json(result);
    else
        return res.status(404).send(`Results for the provider ${req.params.providerid} is not found`);
}

methods.pushIssuesOfScan = async (scanId, applicationId, token, providerId) => {
    const issues = await issueService.getIssuesOfJobThroughReports(scanId, token, true);
    logger.info(`${issues.length} issues found in the scan ${scanId} and the scan is associated to the application ${applicationId}`);
    const issuesData = await pushIssuesToIm(providerId, applicationId, issues, token);
    issuesData["scanId"]=scanId;
    issuesData["syncTime"]=new Date();
    return issuesData;
}

methods.pushIssuesOfApplication = async (applicationId, token, providerId) => {
    const issues = await issueService.getIssuesOfApplication(applicationId, token);
    logger.info(`${issues.length} issues found in the application ${applicationId}`);
    const issuesData = await pushIssuesToIm(providerId, applicationId, issues, token);
    issuesData["applicationId"]=applicationId;
    return issuesData;
}

pushIssuesToIm = async (providerId, applicationId, issues, token) => {
    var imConfig = await getIMConfig(providerId);
    imConfig["providerId"] = providerId;
    const filteredIssues = await igwService.filterIssues(issues, applicationId, imConfig, token);
    logger.info(`Issues count after filtering is ${filteredIssues.length}`);
    var result = await igwService.createImTickets(filteredIssues, imConfig);

    var successArray = result.success;
    if (typeof successArray === 'undefined') return result;
    for(var j=0; j<successArray.length; j++){
        var issueObj = successArray[j];
        const issue = filteredIssues.filter(issue => issue.issueId===issueObj.issueId);
        //Update External Id
        var data = {};
        data["appReleaseId"] = applicationId;
        data["lastUpdated"] = issue[0].lastUpdated;
        var attributeArray = [];
        var attribute = {};
        attribute["name"] = "External Id";
        attribute["value"] = [issueObj.ticket];
        attributeArray.push(attribute);
        var attributeCollection = {};
        attributeCollection["attributeArray"] = attributeArray;
        data["attributeCollection"] = attributeCollection;
        const updateResult = await issueService.updateIssue(issueObj.issueId, data, token, issue[0].etag);
        if(updateResult.code != 200)
            issueObj["error"] = updateResult.data;
    }

    return result;
}

getIMConfig = async (providerId) => {
    try {
        const imConfig = await igwService.getIMConfig(providerId); 
        if(!imConfig) {
            logger.error(`Configuration does not exist for provider ${providerId}`);
            return;
        }
        else 
            return await JSON.parse(imConfig);
    }
    catch(error) {
        logger.error(`Reading the configuration failed for the provider ${providerId} with errors ${error}`);
        throw error;
    }
}

module.exports = methods;

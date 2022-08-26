const log4js = require("log4js");
const logger = log4js.getLogger("issueController");
const issueService = require("../service/issueService");


var methods = {};

methods.getIssuesOfJob = async (req, res) => {
    const traffic = (req.query.traffic != 'undefined') ? req.query.traffic : false;
    try {

        const issues  = await issueService.getIssuesOfJobThroughReports(req.params.jobId, req.token, traffic);
        return res.status(200).json(issues);
    }
    catch(error) {
        logger.error("Failed to get issues of Job: " + error);
        return res.status(500).send("Failed to get issues of Job");
    }
}


methods.getIssuesOfApplication = async (req, res) => {
    const appId = req.params.appId;
    try {
        const issues = await issueService.getIssuesOfApplication(appId, req.token);
        issues.data.forEach(element => {
            element["Scan Name"] = element["Scan Name"].replaceAll("&#40;", "(").replaceAll("&#41;", ")");
            element["Location"] = element["Location"].replaceAll("&#40;", "(").replaceAll("&#41;", ")");
            element["Issue Type"] = element["Issue Type"].replaceAll("&#40;", "(").replaceAll("&#41;", ")");
        });
        res.status(issues.code).json(issues.data);
    }
    catch(error) {
        logger.error("Failed to get issues of application: " + error);
        return res.status(500).send("Failed to get issues of application");
    }
}

methods.updateIssue = async (req, res) => {
    const appId = req.params.appId;
    const issueId = req.params.issueId;
    const attributes = (req.params.attributes) ? req.params.attributes : [];

    try {
        var result = await issueService.getIssueDetails(appId, issueId, req.token);
        var issue = result.data;
        if(result.code === 200){
            var data = {};
            data["appReleaseId"] = appId;
            data["lastUpdated"] = issue.lastUpdated;
            var attributeArray = [];
            for (var i=0; i<attributes.length; i++){
                var attribute = {};
                attribute["name"] = attributes[i].name;
                attribute["value"] = [attributes[i].value];
                attributeArray.push(attribute);
            }
            data["attributeCollection"]["attributeArray"] = attributeArray;
            console.log(JSON.stringify(data, null, 4));
            const updateIssueResult = await issueService.updateIssue(issueId, data, token);
            return res.status(updateIssueResult.code).json(updateIssueResult.data); 
        }        
    } catch (error) {
        logger.error("Failed to update the issue of an application: " + error);
        return res.status(500).send("Failed to update the issue of an application");        
    }

}

methods.getIssue = async (req, res) => {
    const appId = req.params.appId;
    const issueId = req.params.issueId;

    try {
        var result = await issueService.getIssueDetails(appId, issueId, req.token);
        res.status(result.code).json(result.data);
    } catch (error) {
        logger.error(`Fetching issue details failed for the issueId ${issueId} with an error ${error}`);
        return res.status(500).send("Failed to get issue attributes");        
    }
}

methods.getHTMLIssueDetails = async (req, res) => {
    const appId = req.params.appId;
    const issueId = req.params.issueId;

    try {
        const downloadPath = "./temp/"+issueId+".zip";
        const result = await issueService.getHTMLIssueDetails(appId, issueId, downloadPath, req.token);
        console.log("result ... "+result);
        if (result) return res.download(downloadPath);
        else res.status(500).send(`Failed to download HTML file having details of the issue ${issueId}`);
    } catch (error) {
        logger.error(`Downloading HTML file having issue details failed for the issueId ${issueId} with an error ${error}`);
        return res.status(500).send(`Failed to download HTML file having details of the issue ${issueId}`);
    }
}

module.exports = methods;

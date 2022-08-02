const log4js = require("log4js");
const logger = log4js.getLogger("jobController");
const issueService = require("../service/issueService");
const jobService = require("../service/jobService");


var methods = {};

methods.getIssuesOfJob = async (req, res) => {
    const jobId = req.params.jobId;
    const traffic = (req.query.traffic != 'undefined') ? req.query.traffic : false;
    try {
        //const issues = await issueService.getIssuesOfJob(jobId);
        const reportpacksResult = await jobService.getReportPacks(jobId, req.token);
        const reportpacks = reportpacksResult.data;
        var reportPackId = (reportpacks) ? reportpacks[0].reportPackId : undefined;
        if(!reportPackId) {
            logger.error("No reportpacks available for jobId "+jobId);
            return res.status(404).send("Resource is not available.");
        }
        
        const reportsResult = await jobService.getReportsInReportPack(reportPackId, req.token);
        const reportsObj = reportsResult.data;

        if(!reportsObj.reports.report) {
            logger.error("No reports available for reportpack id "+reportPackId);
            return res.status(404).send("Resource is not available.");
        }
        var reportId;
        reportsObj.reports.report.forEach(element => {
            if (element.name === "Security Issues") reportId = element.id;
        })

        if(!reportId) return res.status(404).send("Resource is not available.");

        const issuesResult = await jobService.getIssuesOfReport(reportId, req.token);
        const issues = (!issuesResult.data["wf-security-issues"]) ? [] : issuesResult.data["wf-security-issues"].issue;
        for(var i=0; i<issues.length; i++) {
        //issues.forEach(async element => {
            var element  = issues[i];
            element["issue-id"] = element["issue-id"].content;
            if (traffic==='true'){
                const issueTraffic = await jobService.getIssueTrafficData(reportId, element["issue-id"], req.token);

                try {
                    if (issueTraffic.data["security-issue"]["issue-details"].variants.variant.reasoning["validation-infos"]["validation-info"][0])
                        element["reasoning"] = issueTraffic.data["security-issue"]["issue-details"].variants.variant.reasoning["validation-infos"]["validation-info"][0].content;
                } catch (error) {
                    console.log(error);
                }

                try {
                    if (issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["original-http-traffic"].content)
                    element["original-http-traffic"] = issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["original-http-traffic"].content;
                } catch (error) {
                    console.log(error);
                }

                try {
                    if (issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["test-http-traffic"].content)
                    element["test-http-traffic"] = issueTraffic.data["security-issue"]["issue-details"].variants.variant.traffic["test-http-traffic"].content;
                } catch(error) {
                    console.log(error);
                }
            }
        }

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


module.exports = methods;

const log4js = require("log4js");
const logger = log4js.getLogger("jobController");
const applicationService = require("../service/applicationService");


var methods = {};

methods.updateApplication = async (req, res) => {
    try {

        const appDetails = await applicationService.getApplicaiton(req.params.appId, req.token);

        var attributes = req.body.attributes;
        if (attributes) {
            attributes.forEach(element => {
                element.value = [element.value];
            });
            var attributeCollection = {"attributeArray": attributes};
            var inputData = {"attributeCollection": attributeCollection};
        }
        inputData["name"] = req.body.name;
        inputData["description"] = req.body.description;
        inputData["id"] = req.params.appId;
        var result = await applicationService.updateApplication(inputData, req.params.appId, appDetails.data.etag, req.token);
        if(result.data.attributeCollection.attributeArray){
            result.data["attributes"] = result.data.attributeCollection.attributeArray;
            delete result.data.attributeCollection;
        }         
        return res.status(result.code).json(result.data);
    }
    catch(error) {
        logger.error("Update application - " + JSON.stringify(error));
        return res.status(error.code).send(error.data);
    } 
}

methods.getApplications = async (req, res) => {
    try{
        var result = await applicationService.getApplicaitons(req.token);
        return res.status(result.code).json(result.data);
    }
    catch(error){
        logger.error("Get application - " + JSON.stringify(error));
        return res.status(error.code).send(error.data);
    }
}

methods.createApplication = async (req, res) => {
    try {
        var attributes = req.body.attributes;
        attributes.forEach(element => {
            element.value = [element.value];
        });
        var attributeCollection = {"attributeArray": attributes};
        var inputData = {"attributeCollection": attributeCollection};
        inputData["name"] = req.body.name;
        inputData["description"] = req.body.description;
        var result = await applicationService.createApplication(inputData, req.token);
        if(result.data.attributeCollection.attributeArray){
            result.data["attributes"] = result.data.attributeCollection.attributeArray;
            delete result.data.attributeCollection;
        }         
        return res.status(result.code).json(result.data);
    }
    catch(error) {
        logger.error("Create application - " + JSON.stringify(error));
        return res.status(error.code).send(error.data);
    } 
}


methods.deleteApplication = async (req, res) => {
    try{
        var result = await applicationService.deleteApplicaiton(req.params.appId, req.token);
        return res.status(result.code).json(result.data);
    }
    catch(error){
        logger.error("Delete application - " + JSON.stringify(error));
        return res.status(error.code).send(error.data);
    }
}


methods.getApplication = async (req, res) => {
    try{
        var result = await applicationService.getApplicaiton(req.params.appId, req.token);
        if(result.data.attributeCollection.attributeArray){
            result.data["attributes"] = result.data.attributeCollection.attributeArray;
            delete result.data.attributeCollection;
        } 
        return res.status(result.code).json(result.data);
    }
    catch(error){
        logger.error("Get application - " + JSON.stringify(error));
        return res.status(error.code).send(error.data);
    }
}


module.exports = methods;

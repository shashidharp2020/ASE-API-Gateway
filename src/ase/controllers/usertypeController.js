const log4js = require("log4js");
const logger = log4js.getLogger("usertypeController");
const userTypeService = require('../service/userTypeService');

var methods = {};

methods.getAllUserTypes = async (req, res) => {
	try{
		const result = await userTypeService.getAllUserTypes(req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to retrieve user types present in the system: "+JSON.stringify(error));
        return res.status(500).send("Failed to retrieve user types present in the system");
	}
};

methods.getUserType = async (req, res) => {
	try {
		const result = await userTypeService.getAllUserTypes(req.token);
		const userTypes = result.data;
		for(var i=0; i<userTypes.length; i++) 
			if (userTypes[i].id == req.params.userTypeId) return res.status(result.code).json(userTypes[i]);
		
		res.status(404).send("Usertype does not exist");
	}
	catch(error) {
		logger.error("Failed to retrieve user type for the Id : "+req.params.userTypeId);
        return res.status(500).send("Failed to retrieve user type for the Id : "+req.params.userTypeId);
	}

};


methods.createUserType = async(req, res) => {
	try {
		const result = await userTypeService.createUserType(req.body, req.token);
        return res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to create a user type." + JSON.stringify(error));
        return res.status(500).send("Failed to create a user type.");
	}
};


methods.editUserType = async(req, res) => {
	try {
		var data = req.body;
		data["usertypeId"] = req.params.userTypeId
		const result = await userTypeService.editUserType(data, req.token);
        return res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to create a user type." + JSON.stringify(error));
        return res.status(500).send("Failed to create a user type.");
	}
};

methods.deleteUserType = async(req, res) => {
	try {
		const result = await userTypeService.deleteUserType(req.params.userTypeId, req.token);
        return res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to delete a user type. " + JSON.stringify(error));
        return res.status(500).send("Failed to delete a user type.");
	}
};

methods.getUserTypePermissions = async (req, res) => {
	try{
		const result = await userTypeService.getUserTypePermissions(req.token);
		res.status(result.code).json(result.data);
	}
	catch(error) {
		logger.error("Failed to retrieve user type permissions present in the system: "+JSON.stringify(error));
        return res.status(500).send("Failed to retrieve user type permissions present in the system");
	}
};



module.exports = methods;

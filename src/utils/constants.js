module.exports = Object.freeze({
	//APP_LOG: 'logs/application.log',
	//MAXLOGSIZE: 10485760,
	//NUMBER_OF_BACKUPS: 3,
	LOG_LEVEL: "debug",
	LOG_APPENDER1: "out",
	LOG_APPENDER2: "app",
	CONTEXT_URL: "/ase/api",
	SWAGGER_CONTEXT_URL: "/ase/api/swagger",
	SWAGGER_PAGE_URL: "Swagger page URL is - ",
	START_SERVER_MSG: "Server started.....",
	AUTH_TOKEN: "auth-token",
	TOKEN_ABSENT: "Token does not exist or invalid token",
	TOKEN_EXPIRY_TIME: 7200, //JWT expiry time is 2 hours
	JWT_SECRET_KEY: "2021_token_for_ase_for_SailPointService",
	WRONG_INPUT: "Wrong input",
	ACCOUNT_NOT_EXIST: "Account does not exist by this name.",
	BAD_DATA: "Bad data",
	INACTIVE: "Inactive",
	ACTIVE: "Active",
	USERID: "userId",
	USERNAME: "userName",
	USERTYPEID: "userTypeId",
	EMAIL: "email",
	FULLNAME: "fullName",
	FIRST_NAME: "first_name",
	MIDDLE_NAME: "middle_name",
	LAST_NAME: "last_name",
	ISGROUP: "isGroup",
	ACCOUNT_ID: "account_id",
	ACCOUNT_NAME: "account_name",
	ACCOUNT_STATUS: "account_status",
	GENERIC_ATTR_1: "generic_attr_1",
	GENERIC_ATTR_2: "generic_attr_2",
	GENERIC_ATTR_3: "generic_attr_3",
	GENERIC_ATTR_4: "generic_attr_4",
	GENERIC_ATTR_5: "generic_attr_5",
	IS_PRIVILEGED: "is_privileged",
	ROLE: "role",
	ENTITLEMENTS: "entitlements",
	CORRELATION_ATTR_1: "correlation_attr_1",
	ENTITLEMENT_ID: "entitlement_id",
	ENTITLEMENT_NAME: "ent_value",
	ID: "id",
	NAME: "name",
	ASC_SESSION_ID: "asc_session_id",
	KEYLOGIN_API_FAIL: "keylogin API failed. Possible wrong credentials",
	KEYLOGIN_API_FAIL_ERROR: "keylogin API failed with this error :",
	CONTEXT_API: "/api",
	SAILPOINT_INTERFACE: "SailPointInterface",
	SWAGGER_VERSION: "1.0.0",
	INVALID_ACCOUNT_ID: "Invalid Account Id",
	INVALID_ENTITLEMENT_ID: "Invalid Entitlement Id",
	INVALID_ACCOUNT_NAME: "Invalid Account Name",
	INVALID_ENTITLEMENT_NAME: "Invalid Entitlement Name",
	INVALID_EMAIL: "Invalid Email",
	INVALID_FIRST_NAME: "Invalid first name",
	INVALID_MIDDLE_NAME: "Invalid middle name",
	INVALID_LAST_NAME: "Invalid last name",
	SUCCESS: "Success",
	ACCOUNT_TYPE: "account_type",
	ACCOUNT_TYPE_REGULAR: "Regular",
	ENT_OWNER: "ent_owner",
	ENT_TYPE: "ent_type",
	DISPLAY_NAME: "display_name",
	DESCRIPTION: "description",
	REQUESTABLE: "requestable",
	BIRTHRIGHT: "birthright",

	//ASE APIs
	ASE_CONSOLEUSERS: "/api/consoleusers/",
	ASE_GET_USERTYPES: "/api/usertypes",
	ASE_API_KEYLOGIN: "/api/keylogin/apikeylogin",
	ASE_CREATE_USERTYPE: "/api/usertypes/createUserType",
	ASE_DELETE_USERTYPE: "/api/usertypes/deleteUserType/",
	ASE_GET_PERMISSIONS: "/api/usertypes/userTypePermissions",

	ASE_CREATE_SCAN: "/api/jobs/{TEMPLATEID}/dastconfig/createjob",
	ASE_UPDATE_SCAN: "/api/jobs/{JOBID}/dastconfig/updatescant",
	ASE_UPDATE_SCAN_TYPE: "/api/jobs/scantype?scanTypeId={SCANTYPEID}&jobId={JOBID}",
	ASE_DESIGNATE_AGENT_SERVER: "/api/jobs/{JOBID}/designateAgentServer/{SERVERID}",
	ASE_ADDIONAL_DOMAINS: "/api/jobs/{JOBID}/addAdditionalDomains",
	ASE_ALERT_SUBSCRIPTION: "/api/jobs/{JOBID}/configureAlert?isAdminRequired=false",
	ASE_SCAN_SCHEDULE: "/api/jobs/schedulescan/{JOBID}?responseFormat=json",
	ASE_FILE_UPLOAD: "/api/jobs/{JOBID}/dastconfig/updatetraffic/{ACTION}",
	ASE_SCAN_DETAILS: "/api/jobs/{JOBID}",
	ASE_SCAN_RUN: "/api/jobs/{JOBID}/actions",
	ASE_SCAN_REPORTPACKS: "/api/folderitems/{JOBID}/reportPack",

	ASE_CREATE_APPLICATION: "/api/applications",
	ASE_DELETE_APPLICATION: "/api/applications/{APPID}",
});

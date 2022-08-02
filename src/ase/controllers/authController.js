const log4js = require("log4js");
const logger = log4js.getLogger("authController");
const https = require('https');
const jsonwebtoken = require('../../utils/jsonwebtoken');
const util = require('../../utils/util');
const constants = require('../../utils/constants');
var methods = {};

methods.keyLogin = (req, res) =>
{
    try
    {
        const data = JSON.stringify({
            "keyId": req.body.keyId,
            "keySecret": req.body.keySecret
          });

        const options = util.httpOption("", 'POST', constants.ASE_API_KEYLOGIN, data.length);

        const req1 = https.request(options, (res1) => {
            res1.on('data', (d) => {
                var respObj = JSON.parse(d);
                if (typeof respObj.sessionId != 'undefined')
                {
                    var token = jsonwebtoken.createToken(respObj.sessionId);
                    res.cookie(constants.ASC_SESSION_ID, respObj.sessionId);

                    res.status(200).json({
                        "token": token
                    });
                    logger.info("keyLogin: Successfully authenticated the user.");
                    return;
                }
                {
                    res.status(404).json({"message": constants.KEYLOGIN_API_FAIL});
                }
            });
        });          
        req1.on('error', (error) => {
            logger.error(constants.KEYLOGIN_API_FAIL_ERROR + error);
            res.status(400).json({"message": error});
        });

        req1.write(data);
        req1.end();
    }    
    catch (e)
    {
        logger.error(constants.KEYLOGIN_API_FAIL_ERROR + e);
        res.status(500).json({"message": e});
    }
}


module.exports = methods;
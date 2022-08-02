const constants = require('./constants');
const https = require("https");
const FormData = require("form-data");
const logger = require('node-windows/lib/eventlog');

var methods = {};
methods.resolveFullName = function(fullName) {
    var userObject = {};
    userObject[constants.LAST_NAME] = "";
    userObject[constants.FIRST_NAME] = "";
    userObject[constants.MIDDLE_NAME] = "";

    if(fullName.includes(", ")) {
        const array1 = fullName.split(", ");
        userObject[constants.LAST_NAME] = array1[0];
        
        const array2 = array1[1].split(" ");
        userObject[constants.FIRST_NAME] = array2[0];    
        userObject[constants.MIDDLE_NAME] = (typeof array2[1] != 'undefined')? array2[1] : "";
    }
    else {
        userObject[constants.LAST_NAME] = fullName;    
    }

    return userObject;
}

methods.constuctFullName = (first_name, middle_name, last_name) => {
    if (typeof first_name === 'undefined' || first_name.length===0)
        return null;
    else if (typeof last_name === 'undefined' || last_name.length===0)    
        return null;
    else if (typeof middle_name === 'undefined' || middle_name.length===0)        
        return last_name+", "+first_name;
    else 
        return last_name+", "+first_name+" "+middle_name;
}

methods.httpOption = function(token, method, url, dataLength, etag) {
    return {
        hostname: process.env.ASE_HOSTNAME,
        port: process.env.ASE_PORT,
        path: '/'+process.env.ASE_CONTEXT+url,
        rejectUnauthorized: (process.env.REJECT_UNAUTHORIZED==='true'),
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': typeof dataLength==='undefined' ? 0 : dataLength,
          'Cookie': 'asc_session_id='+token,
          'asc_xsrf_token': token,
          'If-Match': etag ? etag : ''
        }
    };
}

methods.httpCall = function(method, token, url, data, etag) {
    const dataLength = data ? data.length : 0; 
    const httpOptions = methods.httpOption(token, method, url, dataLength, etag);
    return new Promise((resolve, reject) => {
        const req = https.request(httpOptions, (res) => {
            if (res.statusCode >= 200 && res.statusCode <= 299) {
                var result;
                var data="";
                res.on("data", async (d) => {
                    data = data + d;
                }).on("end", () => {
                    try{
                        result = JSON.parse(data);
                    }
                    catch(error){
                        //console.log("data is not a json object");
                        //do nothing.
                    }
                    (result) ? resolve({"code": res.statusCode, "data": result}) : resolve({"code": res.statusCode});
                    if(method==="GET" && res.headers["etag"]) result["etag"] = res.headers["etag"];
                }).on("error", (error) => {
                    reject({"code": 500, "data": "Internal Server Error "+ error});
                });
            }
            else 
                reject({"code": res.statusCode, "data": res.statusMessage});
        });

        if((method==="POST" || method==="PUT") && dataLength > 0) req.write(data);
        req.end();
    });
}


methods.httpFileUpload = function(token, url, filePath, fileName) {
		var formData = new FormData();
		const stream = require("fs").createReadStream(filePath);

		formData.append("uploadedfile", stream, "file.dast.config");
		formData.append("asc_xsrf_token", token);
		const formHeaders = formData.getHeaders();

        var httpOptions = {
            hostname: process.env.ASE_HOSTNAME,
            port: process.env.ASE_PORT,
            path: '/'+process.env.ASE_CONTEXT+url,
            rejectUnauthorized: (process.env.REJECT_UNAUTHORIZED==='true'),
            method: "POST",
            headers: {
              Cookie: "asc_session_id="+token,
              asc_xsrf_token: token,
              ...formHeaders,
            },
        };

        return new Promise((resolve, reject) => {
            const req = https.request(httpOptions, (res) => {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    res.on("data", async (d) => {
                        resolve({"code": res.statusCode, "data": JSON.parse(d)});
                    }).on("end", () => {
                        resolve({"code": res.statusCode});
                    }).on("error", (error) => {
                        reject({"code": 500, "data": "Internal Server Error "+ error});
                    });
                }
                else 
                    reject({"code": res.statusCode, "data": res.statusMessage});
            });
    
            formData.pipe(req);
        });
}


module.exports = methods;
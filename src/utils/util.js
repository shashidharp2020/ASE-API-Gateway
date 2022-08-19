const constants = require('./constants');
const https = require("https");
const http = require("http");
const FormData = require("form-data");
const logger = require('node-windows/lib/eventlog');
const axios = require('axios').default;

var methods = {};

methods.httpASEOption = function(token, method, url, dataLength, etag) {
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

// methods.httpJiraOption = function(token, method, url, dataLength) {
//     return {
//         hostname: process.env.JIRA_HOSTNAME,
//         port: process.env.JIRA_PORT,
//         path: url,
//         rejectUnauthorized: (process.env.REJECT_UNAUTHORIZED==='true'),
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Content-Length': typeof dataLength==='undefined' ? 0 : dataLength,
//           'Authorization': 'Bearer '+token
//         }
//     };
// }


methods.httpCall = function(method, token, url, data, etag) {
    const dataLength = data ? data.length : 0; 
    const httpOptions = methods.httpASEOption(token, method, url, dataLength, etag);
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

jiraConfig = function(method, token, url, data) {
    return {
        method: method,
        url: url,
        data: data,        
        headers: {
            'Authorization': 'Bearer '+token, 
            'Content-Type': 'application/json'
        }
    };
}

// getHeaders = (token) => {
//     return {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": token
//         }
//     }
// };

methods.httpJiraCall = async (method, token, url, data) => {
    const config = await jiraConfig(method, token, url, data);
    const result = await axios(config);
    return {"code": result.status, "data": result.data};
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
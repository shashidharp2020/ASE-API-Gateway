# SailPointInterface

## Installation steps

1.  Install the latest Node JS runtime (https://nodejs.org/en/)
2.  Download the source code from the repository.
3.  Open the command prompt from the home directory and run the command "npm install". This installs all the required npm libraries.
4.  Edit the file '.env' from home directory to make changes to the below properties.  
     ASE_HOSTNAME = \<Hostname of the box where AppScan Enterprise is installed.\>  
     ASE_PORT = \<Port the AppScan Enterprise is listening to\>  
     ASE_CONTEXT = \<The context name in the AppScan Enterprise URL\>  
     REJECT_UNAUTHORIZED = \<To verify the AppScan Enterprise Certificate. The default value is false. To change it to true, it is required to set envirnment variable "NODE_EXTRA_CA_CERTS" having value i.e. path to the root certificate (pem format) of the AppScan Enterprise server certificate. \>  
     SECURE_PORT = \<Port SailPointInterface application listens to\>  
     SSL_PFX_CERT_FILE = \<Path to certificate in pfx format.\>  
     SSL_PFX_CERT_PASSPHRASE = \<Certificate passphrase/password\>  
     DEFAULT_USER_TYPE_ID = \<This decides the default role of the user created through this application. The default value is 3 i.e. "QuickScan User"\>  
     APP_LOG = \<Path and name of the log file\>  
     MAXLOGSIZE = \<Maximum size of the log file\>  
     NUMBER_OF_BACKUPS = \<Number of backups\>
5.  Start the 'SailPointInterface' application running the command "npm start" from the home directory.
6.  Access the APIs swagger page using the URL https://\<hostname\>:\<port\>/appscan/api/swagger. You can get this URL from the console/log.
7.  To install/uninstall the application as a Windows Service run below commands from home directory.  
    node service.js --install  
    node service.js --uninstall

## APIs available -

a) POST /auth/keylogin  
b) GET /api/accounts  
c) GET /api/accounts/{accountid}  
d) GET /api/entitlements  
e) GET /api/entitlements/{entitlementid}  
f) PUT /api/accounts  
g) PUT /api/accounts/{accountid}/update  
h) PUT /api/entitlements  
i) DELETE /api/entitlements/{entitlementid}  
j) PUT /api/accounts/{accountid}/enable  
k) PUT /api/accounts/{accountid}/disable  
l) DELETE /api/accounts/{accountid}  
m) GET /api/entitlements/user/permissions/ -> This is an additional api that provides required information to create entitlement.  

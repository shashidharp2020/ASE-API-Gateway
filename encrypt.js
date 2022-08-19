var crypto = require('crypto'); 
var constants = require('./src/utils/constants'); 
var args = process.argv.slice(2);

if (args.length > 0)
    console.log(crypto.pbkdf2Sync(args[0], constants.HASHING_SALT,  1000, 64, 'sha512').toString('hex')); 
else
    console.log("Enter plain text password as an argument....");




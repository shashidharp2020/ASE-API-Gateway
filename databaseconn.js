const connectionString = 'Driver={SQL Server Native Client 11.0};Server='+ process.env.DATABASE_SERVER +','+ process.env.DATABASE_PORT +';Database='+ process.env.DATABASE_NAME +';Trusted_Connection=yes;'
module.exports.config = connectionString;

const { Pool } = require('pg');
const dotenv = require('dotenv');

// load env file
dotenv.config()
const RDS_MASTER_USERNAME = process.env.RDS_MASTER_USERNAME;
const RDS_ENDPOINT = process.env.RDS_ENDPOINT;
const RDS_DATABASE_NAME = process.env.RDS_DATABASE_NAME;
const RDS_MASTER_PASSWORD = process.env.RDS_MASTER_PASSWORD;

// create a new pool
const pool = new Pool ({
    user: RDS_MASTER_USERNAME,
    host: RDS_ENDPOINT,
    database: RDS_DATABASE_NAME,
    password: RDS_MASTER_PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// export the pool function
module.exports = pool;
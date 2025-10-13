const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const dotenv = require('dotenv');
const { Pool } = require('pg');

// load env file
dotenv.config();
const RDS_SECRET_NAME = process.env.RDS_SECRET_NAME;
const RDS_SECRET_REGION = process.env.RDS_SECRET_REGION;
const RDS_ENDPOINT = process.env.RDS_ENDPOINT;
const RDS_PORT = process.env.RDS_PORT;
const RDS_DATABASE_NAME = process.env.RDS_DATABASE_NAME;

const secret_name = RDS_SECRET_NAME;
const region = RDS_SECRET_REGION;

async function getRDSSecret() {
    const client = new SecretsManagerClient({region: region});
    let response;
    try {
        response = await client.send(
            new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
        if (response.SecretString) {
            const secret = JSON.parse(response.SecretString);
            console.log("✅ Secrets retrieved successfully.");
            return secret;
        }
    } catch (error) {
        console.error("❌ Failed to retrieve secrets:", error);
        throw error;
    }
}

async function getPool() {
    console.log("Creating new DB connection pool...");
    const secrets = await getRDSSecret();

    const dbConfig = {
      host: RDS_ENDPOINT,
      user: secrets.username,
      password: secrets.password,
      database: RDS_DATABASE_NAME,
      port: RDS_PORT,
      ssl: {
        rejectUnauthorized: false 
      },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

    pool = new Pool(dbConfig);
    console.log("✅ DB connection pool created successfully.");
    return pool;
}

module.exports.query = async (text, params) => {
    const dbPool = await getPool();
    return dbPool.query(text, params);
};
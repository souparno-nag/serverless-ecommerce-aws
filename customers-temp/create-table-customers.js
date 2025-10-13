'use strict';

const db = require('../shared/database/rds-pool-secret');

async function create_table () {
    const queryText = `CREATE TABLE customers (
        username VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dob DATE,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(15),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    // const values = [];
    // const {rows} = await db.query(queryText, values);
    // console.log(rows);    
    // return;
    try {
        console.log("Attempting to create the customers table...");
        const result = await db.query(queryText);
        console.log("✅ Table 'customers' created successfully or already exists.");
        console.log("Query result command:", result.command);
    } catch (error) {
        console.error("❌ Error creating table:", error);
    }
}

create_table()
    .then(() => console.log("Script finished."))
    .catch(() => console.error("Script finished with an error."));
require('dotenv').config();
const pool = require('.../rds-connect/rds-connect.js');

const client = await pool.connect();

const check_customers_exists = async () => {
    const check_customers_exists_query = "SELECT EXISTS ( SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Customers'";
    const res = await client.query(check_customers_exists_query);
    if (res.rows[0].exists == 'true') {
        return true;
    } else if (res.rows[0].exists == 'false') {
        return false;
    }
};

if (!check_customers_exists) {
    const create_customers_table_query = `CREATE TABLE Customers (
    username VARCHAR2(30) PRIMARY KEY,
    name VARCHAR2(30) NOT NULL,
    dob DATE,
    email VARCHAR2(40) UNIQUE NOT NULL,
    phone_number NUMBER(10),
    password_hash VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    const res = await client.query(create_customers_table_query);
    console.log(res);    
}
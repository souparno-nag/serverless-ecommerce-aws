'use strict';

const db = require('./db');
const bcrypt = require('bcryptjs');

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

module.exports.registerCustomer = async (event) => {
    try {
        const {username, name, dob, email, phone_number, password} = JSON.parse(event.body);
        if (!username || !name || !email || !password) {
            return createResponse(400, {message: 'Username, name, email and password are required.'});
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const query = `
        INSERT INTO customers (username, name, dob, email, phone_number, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, created_at;
        `;
        const values = [username, name, dob, email, phone_number, passwordHash];
        
        const {rows} = await db.query(query, values);
        return createResponse(201, { message: 'Customer created successfully.', customer: rows[0] });
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { // PostgreSQL unique violation
            return createResponse(409, { message: 'Username or email already exists.' });
        }
        return createResponse(500, { message: 'Internal Server Error', error: error.message });
    }
}

module.exports.getCustomer = async (event) => {
  try {
    const { username } = event.pathParameters;
    const { rows } = await db.query('SELECT username, name, dob, email, phone_number, created_at FROM customers WHERE username = $1', [username]);

    if (rows.length === 0) {
      return createResponse(404, { message: 'Customer not found.' });
    }
    return createResponse(200, rows[0]);
  } catch (error) {
    console.error(error);
    return createResponse(500, { message: 'Internal Server Error' });
  }
};

module.exports.updateCustomer = async (event) => {
    try {
        const { username } = event.pathParameters;
        const { name, dob, phone_number } = JSON.parse(event.body);

        if (!name && !dob && !phone_number) {
            return createResponse(400, { message: 'No fields to update provided.' });
        }
        const { rows } = await db.query(
            'UPDATE customers SET name = $1, dob = $2, phone_number = $3 WHERE username = $4 RETURNING username, name, dob, phone_number',
            [name, dob, phone_number, username]
        );
        if (rows.length === 0) {
            return createResponse(404, { message: 'Customer not found.' });
        }
        return createResponse(200, { message: 'Customer updated successfully.', customer: rows[0] });

    } catch (error) {
        console.error(error);
        return createResponse(500, { message: 'Internal Server Error' });
    }
};

module.exports.deleteCustomer = async (event) => {
    try {
        const { username } = event.pathParameters;
        const { rowCount } = await db.query('DELETE FROM customers WHERE username = $1', [username]);

        if (rowCount === 0) {
            return createResponse(404, { message: 'Customer not found.' });
        }
        return createResponse(200, { message: 'Customer deleted successfully.' });

    } catch (error) {
        console.error(error);
        return createResponse(500, { message: 'Internal Server Error' });
    }
};
const crypto = require('crypto');
const db = require('../config/db');
const { encrypt } = require('./encryption');

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex'); // Generate a random session ID
}

function createSession(sessionData, userEmail, role, res) {
    return new Promise((resolve, reject) => {
        const sessionId = generateSessionId();
        const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours / 1 day
        const encryptedData = encrypt(sessionData); // Encrypt session data

        // Save session in the database
        db.query(
            'INSERT INTO sessions (session_id, user_email, session_role, data, expires_at) VALUES (?, ?, ?, ?, ?)',
            [sessionId, userEmail, role, encryptedData, expirationTime],
            (err, results) => {
                if (err) {
                    console.error('Error inserting session into database:', err);
                    return reject('Error inserting session into database');
                }

                // Set session cookie
                res.cookie('session_id', sessionId, {
                    httpOnly: true,   // Set secure to true in production
                    secure: false,
                    maxAge: 1000 * 60 * 60 * 24, // 1 week
                }); 
                resolve(); // Resolve the promise when session is created successfully
            },
        );
    });
}

module.exports = createSession;

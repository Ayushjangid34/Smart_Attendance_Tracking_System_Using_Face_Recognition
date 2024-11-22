//const db = require('./Database');
const { decrypt } = require('../utils/encryption');
const db = require('../config/db');
const sessionMiddleware = (req, res, next) => {
    console.log(req.originalUrl);

    const sessionId = req.cookies['session_id']; // Retrieve the session ID from cookies
    if (!sessionId) {
        console.warn('No session ID found in cookies.');
        req.session = {}; // Clear session for safety
        return res.redirect('/?error=session_missing');
    }

    db.query('SELECT * FROM sessions WHERE session_id = ?', [sessionId], (err, results) => {
        if (err) {
            console.error('Error querying database for session:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length > 0) {
            const session = results[0];
            const now = new Date();

            // Check if the session has expired
            if (new Date(session.expires_at) < now) {
                console.warn(`Session expired for session ID: ${sessionId}`);
                req.session = {}; // Clear session
                res.clearCookie('session_id'); // Remove expired session cookie
                return res.redirect('/?error=session_expired');
            }

            try {
                // Decrypt and parse the session data
                req.session = decrypt(session.data);
                console.log('Session loaded successfully:', req.session);
            } catch (e) {
                console.error('Failed to decrypt session:', e);
                req.session = {}; // Clear session on decryption failure
                res.clearCookie('session_id'); // Remove invalid session cookie
                return res.redirect('/?error=failed_to_decrypt _session');
            }
        } else {
            console.warn(`No session found for session ID: ${sessionId}`);
            req.session = {}; // Clear session
            res.clearCookie('session_id'); // Remove invalid session cookie
            return res.redirect('/?error=session_invalid');
        }

        next();
    });
};

module.exports = sessionMiddleware;

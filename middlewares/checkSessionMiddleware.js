const sessionMiddleware = require('./sessionMiddleware');
// Middleware to check cookies and redirect based on role
const checkSessionMiddleware = (req, res, next) => {
    const sessionId = req.cookies['session_id']; // Retrieve the session ID from cookies
    if (!sessionId) {
        console.log('No session ID found in cookies. Proceeding to public routes.');
        return next(); // No session cookie, proceed without redirecting
    }

    // Using sessionMiddleware to validate the session and populate req.session
    sessionMiddleware(req, res, () => {
        // Checking if req.session was populated successfully
        if (req.session && req.session.role && req.session.email) {
            // Role-to-dashboard mapping
            const roleToDashboard = {
                admin: '/admin/dashboard',
                faculty: '/faculty/dashboard',
                student: '/student/dashboard',
            };

            const dashboardUrl = roleToDashboard[req.session.role];

            if (dashboardUrl) {
                console.log(
                    `Valid session detected for ${req.session.email} (${req.session.role}). Redirecting to ${dashboardUrl}`,
                );
                return res.redirect(dashboardUrl);
            }

            console.warn(`Invalid or unknown role detected: ${req.session.role}`);
        }

        // If no valid session or no redirection is applicable, proceed
        next();
    });
};

module.exports = checkSessionMiddleware;

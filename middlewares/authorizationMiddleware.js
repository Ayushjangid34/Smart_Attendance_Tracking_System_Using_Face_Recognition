const authorizationMiddleware = (requiredRole) => (req, res, next) => {
    if (!req.session || !req.session.role) {
        // No session or role: Redirect to login
        return res.redirect('/');
    }

    if (!requiredRole.includes(req.session.role)) {
        // Unauthorized: Show error page or redirect to dashboard
        return res
            .status(403)
            .send(
                'You are not authorized to access this page or you are currently logged in a different role',
            );
        // OR Redirect to user's dashboard
        // return res.redirect(`/${req.session.role}-dashboard`);
    }

    next(); // Role matches; proceed to route
};

module.exports = authorizationMiddleware;

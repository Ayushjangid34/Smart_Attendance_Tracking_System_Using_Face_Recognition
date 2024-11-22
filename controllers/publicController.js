const path = require('path');
const publicPagesPath = path.join(__dirname, '../views/public');
const { routeErrorHandling } = require('../utils/routeErrorHandling');

exports.getHomePage = (req, res) =>
    routeErrorHandling(res, path.join(publicPagesPath, 'home.html'));
exports.getAboutPage = (req, res) =>
    routeErrorHandling(res, path.join(publicPagesPath, 'about.html'));
exports.getAdminLoginPage = (req, res) => {
    if (req.cookies.session_id) return res.redirect('/admin/dashboard');
    routeErrorHandling(res, path.join(publicPagesPath, 'admin-login.html'));
};
exports.getFacultyLoginPage = (req, res) => {
    if (req.cookies.session_id) return res.redirect('/faculty/dashboard');
    routeErrorHandling(res, path.join(publicPagesPath, 'faculty-login.html'));
};
exports.getStudentLoginPage = (req, res) => {
    if (req.cookies.session_id) return res.redirect('/student/dashboard');
    routeErrorHandling(res, path.join(publicPagesPath, 'student-login.html'));
};
exports.getContactUsPage = (req, res) =>
    routeErrorHandling(res, path.join(publicPagesPath, 'contact-us.html'));

const db = require('../config/db');

exports.saveRequestDetails = (req, res) => {
    db.query(
        'INSERT INTO helpRegister (reason, seeker_email) VALUES (?, ?);',
        [req.body.reason, req.body.seeker_email],
        (err, results) => {
            if (err) return res.send('Error While loading your details, Please try again ! ! !');
            const htmlResponse = `<html>
                              <body>
                                  <script>
                                      alert("We will contact you soon ! ! !");
                                      window.location.href = "/";
                                  </script>
                              </body>
                            </html>`;
            res.send(htmlResponse);
        },
    );
};

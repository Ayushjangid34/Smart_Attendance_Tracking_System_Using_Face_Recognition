const db = require('../config/db');
const createSession = require('../utils/sessionCreation');
const path = require('path');
const commonPagesPath = path.join(__dirname, '../views/protected/commonPages');
const { routeErrorHandling } = require('../utils/routeErrorHandling');

//general function for login that can be used for diff users( admin , faculty, student )
const loginUser = async (req, res, role, redirectUrl) => {
    const email = req.body.email;
    const password = req.body.password;

    const roleToTable = {
        admin: 'Admins',
        faculty: 'Faculties',
        student: 'Students',
    };
    const tableName = roleToTable[role];

    if (!tableName) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
        // Query the database to check if the user exists or not
        const query = `SELECT * FROM ${tableName} WHERE Email = ? AND Password = ?`;
        const [results] = await db.promise().query(query, [email, password]);

        if (results.length === 1) {
            const user = results[0];
            const sessionData = {
                email: user.Email,
                userName: user[`${role.charAt(0).toUpperCase() + role.slice(1)}Name`],
                role: role,
            };

            // Create the session and wait for it to complete
            try {
                await createSession(sessionData, user.Email, role, res);
                console.log(role + ' Login successful! for ' + user.Email);
                return res.redirect(redirectUrl);
            } catch (sessionError) {
                console.error('Error during session creation:', sessionError);
                return res.status(500).json({
                    message: 'Error during session creation. Please try again.',
                });
            }
        } else {
            // User not found or invalid credentials
            console.warn(`Login failed for user: ${email}. Invalid credentials.`);
            const htmlResponse = `
              <html>
                  <body>
                      <script>
                          alert("Wrong Password or Email! Please try again.");
                          window.location.href = "/${role}-login";
                      </script>
                  </body>
              </html>`;
            res.status(401).send(htmlResponse); // 401 Unauthorized
        }
    } catch (error) {
        console.error(`Error during ${role} login process:`, error);
        res.status(500).send('Internal Server Error');
    }
};

exports.adminLogin = async (req, res) => {
    console.log(req.body);
    await loginUser(req, res, 'admin', '/admin/dashboard');
};

exports.facultyLogin = async (req, res) => {
    console.log(req.body);
    await loginUser(req, res, 'faculty', '/faculty/dashboard');
};

exports.studentLogin = async (req, res) => {
    console.log(req.body);
    await loginUser(req, res, 'student', '/student/dashboard');
};

exports.getChangePasswordPage = (req, res) =>
    routeErrorHandling(res, path.join(commonPagesPath, 'change-password.html'));

// Function to update password
const updatePassword = async (userEmail, oldpass, newpass, role, tableName, res) => {
    try {
        // Check if the old password matches
        const [results] = await db
            .promise()
            .query(`SELECT * FROM ${tableName} WHERE Email = ? AND Password = ?`, [
                userEmail,
                oldpass,
            ]);

        if (results.length === 1) {
            // Update the password
            await db
                .promise()
                .query(`UPDATE ${tableName} SET Password = ? WHERE Email = ?`, [
                    newpass,
                    userEmail,
                ]);
            const successHtml = `
              <html>
                  <body>
                      <script>
                          alert("Password changed successfully!");
                          window.location.href = "/${role}/dashboard";
                      </script>
                  </body>
              </html>`;
            res.send(successHtml);
        } else {
            const failureHtml = `
          <html>
              <body>
                  <script>
                      alert("Credentials are incorrect!");
                      window.location.href = "/auth/change-password";
                  </script>
              </body>
          </html>`;
            res.send(failureHtml);
        }
    } catch (error) {
        console.error(`Error processing password change for ${role}:`, error);
        return res.status(500).send('Internal Server Error');
    }
    return false;
};

exports.changePassword = async (req, res) => {
    const oldpass = req.body.oldpass;
    const newpass = req.body.newpass;
    // Role-to-table mapping
    const roleToTable = {
        faculty: 'Faculties',
        student: 'Students',
    };
    await updatePassword(
        req.session.email,
        oldpass,
        newpass,
        req.session.role,
        roleToTable[req.session.role],
        res,
    );
};

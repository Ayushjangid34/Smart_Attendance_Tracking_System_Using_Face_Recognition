const path = require('path');
const adminPagesPath = path.join(__dirname, '../views/protected/adminPages');
const { routeErrorHandling } = require('../utils/routeErrorHandling');
const { faculty, student } = require('../models');

exports.getAdminDashboard = (req, res) =>
    routeErrorHandling(res, path.join(adminPagesPath, 'dashboard.html'));
exports.getFacultyRegistration = (req, res) =>
    routeErrorHandling(res, path.join(adminPagesPath, 'register-faculty.html'));
exports.getStudentRegistration = (req, res) =>
    routeErrorHandling(res, path.join(adminPagesPath, 'register-student.html'));

// Route to fetch all faculty data
exports.getAllFaculties = async (req, res) => {
    try {
        const facultyData = await faculty.getAll();
        res.status(200).json(facultyData);
    } catch (err) {
        console.error('Error fetching faculty data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Route to fetch all student data
exports.getAllStudents = async (req, res) => {
    try {
        const studentData = await student.getAllStudents();
        res.status(200).json(studentData);
    } catch (err) {
        console.error('Error fetching student data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.registerStudent = async (req, res) => {
    try {
        const studentData = {
            Student_Name: req.body.Student_Name,
            Email: req.body.Email,
            BranchID: req.body.Branch,
            SectionID: req.body.Section,
            password: req.body.password,
            phone: req.body.phone,
            DOB: req.body.DOB,
        };
        await student.create(studentData);
        const htmlResponse = `<html>
                              <body>
                                  <script>
                                      alert("Student Added Successfully!");
                                      window.location.href = "/admin/dashboard";
                                  </script>
                              </body>
                            </html>`;
        res.send(htmlResponse);
    } catch (err) {
        console.error('Error registering student:', err);
        const htmlResponse = `<html>
                              <body>
                                  <script>
                                      alert("${err}");  // Display the error message
                                      window.location.href = "/admin/student-registration";  // Redirect back to the registration page
                                  </script>
                              </body>
                            </html>`;
        res.send(htmlResponse);
    }
};
// Route to register a new faculty
exports.registerFaculty = async (req, res) => {
    try {
        const facultyData = {
            Email: req.body.Email,
            Name: req.body.Name,
            BranchID: req.body.Branch,
            password: req.body.password,
            phone: req.body.phone,
        };
        await faculty.create(facultyData); // Await the promise from the model
        const htmlResponse = `<html>
                              <body>
                                  <script>
                                      alert("Faculty Added Successfully!");
                                      window.location.href = "/admin/dashboard";
                                  </script>
                              </body>
                            </html>`;
        res.send(htmlResponse);
    } catch (err) {
        console.error('Error registering faculty:', err);
        const htmlResponse = `<html>
                              <body>
                                  <script>
                                      alert("${err}");
                                      window.location.href = "/admin/faculty-registration";
                                  </script>
                              </body>
                            </html>`;
        res.send(htmlResponse);
    }
};

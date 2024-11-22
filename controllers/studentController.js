require('dotenv').config();
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const studentPagesPath = path.join(__dirname, '../views/protected/studentPages');
const { routeErrorHandling } = require('../utils/routeErrorHandling');
const { schedule, student } = require('../models');

// Route to fetch a student's details
exports.getStudentInfo = async (req, res) => {
    try {
        const studentData = await student.getByEmail(req.session.email); // Await the promise
        if (!studentData) return res.status(404).json({ message: 'Student not found' });
        delete studentData.Password; //Removing password from studentData so that client cannot see it
        res.status(200).json(studentData); // Return the found student
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching student', error: err });
    }
};

exports.getStudentDashboard = (req, res) =>
    routeErrorHandling(res, path.join(studentPagesPath, 'dashboard.html'));
exports.getStudentInfoPage = (req, res) =>
    routeErrorHandling(res, path.join(studentPagesPath, 'student-info.html'));

//sending student image to show at frontend
exports.getStudentImage = (req, res) => {
    const imageDir = path.join(__dirname, '../studentImages');
    fs.readdir(imageDir, (err, files) => {
        console.log(imageDir);
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Internal Server Error');
        }
        const imageFile = files.find((file) => file.startsWith(req.session.email));
        if (!imageFile) {
            return res.status(404).send('Image not found for the user');
        }
        res.sendFile(path.join(imageDir, imageFile));
    });
};

// Helper function to remove the uploaded file
const removeUploadedFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to remove file: ${filePath}`, err);
                return reject(err); // Reject if error
            }
            console.log(`Uploaded file removed: ${filePath}`);
            resolve(); // Resolve when file is removed
        });
    });
};

exports.uploadStudentPhoto = (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(req.file.path);

    let alertMessage;

    // Start the Python script execution
    const encodeImage = exec(
        process.env.PYTHON_RUN +' ' + path.join(__dirname, '../faceRecognition', 'encodeStudent.py'),
        async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                alertMessage = `Error while encoding image, try again later! ${error.message} May be due to faulty python libraries, try to reinstalling dlib ! ! !`;
                try {
                    await removeUploadedFile(req.file.path); // Wait for file removal
                } catch (fileErr) {
                    console.error('Failed to remove uploaded file:', fileErr);
                }
                sendResponse();
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                alertMessage = stderr;
                try {
                    await removeUploadedFile(req.file.path); // Wait for file removal
                } catch (fileErr) {
                    console.error('Failed to remove uploaded file:', fileErr);
                }
                sendResponse();
                return;
            }

            // If no errors, process stdout
            console.log(`stdout:\n${stdout}`);
            alertMessage = 'Image uploaded and encoded successfully!';
            sendResponse();
        },
    );

    // Pass input to the child process (Python script expects the email)
    encodeImage.stdin.write(req.session.email);
    encodeImage.stdin.end(); // Close the input stream

    // Function to send the response after everything is done
    function sendResponse() {
        console.log('response sent !');
        const htmlResponse = `
      <html>
        <body>
          <script>
            alert("${alertMessage.replace(/"/g, '').replace(/\n/g, ' ')}");
            window.location.href = "/student/dashboard";
          </script>
        </body>
      </html>
    `;
    console.log(htmlResponse);
        res.send(htmlResponse); // Send the HTML response
    }
};
exports.getStudentSchedule = async (req, res) => {
    try {
        const scheduleData = await schedule.getStudentScheduleByEmail(req.session.email); // Await the promise
        res.status(200).json(scheduleData); // Return the schedule data
    } catch (err) {
        console.error('Error fetching student schedule:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

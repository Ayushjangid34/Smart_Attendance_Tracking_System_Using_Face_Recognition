const path = require('path');
const facultyPagesPath = path.join(__dirname, '../views/protected/facultyPages');
const { routeErrorHandling } = require('../utils/routeErrorHandling');
const { faculty, schedule, attendance } = require('../models');
const Excel = require('exceljs');

exports.getFacultyDashboard = (req, res) =>
    routeErrorHandling(res, path.join(facultyPagesPath, 'dashboard.html'));
exports.getScheduleClassPage = (req, res) =>
    routeErrorHandling(res, path.join(facultyPagesPath, 'schedule-class.html'));

exports.getFacultySchecule = async (req, res) => {
    try {
        const scheduleData = await schedule.getScheduleByFacultyEmail(req.session.email); // Await the promise
        res.status(200).json(scheduleData); // Return the schedule data
    } catch (error) {
        console.error('Error fetching faculty schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getFacultyName = async (req, res) => {
    try {
        const { Name } = await faculty.getByEmail(req.session.email); // Await the promise
        if (!Name) return res.status(404).json({ message: 'Faculty not found' });
        console.log(Name);
        res.status(200).json({ Name }); // Return the found student
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching faculty', error: err });
    }
};

exports.addClass = async (req, res) => {
    try {
        const SectionID = req.body.Section; // Section ID provided directly
        const Class_Room = req.body.Class_Room;
        const Subject_Name = req.body.Subject_Name;
        const Timing = parseInt(req.body.Timing);
        const ClassDate = req.body.ClassDate;
        const FacultyID = req.session.email;

        // Add the class
        const classData = {
            FacultyID,
            SubjectName: Subject_Name,
            DateScheduled: ClassDate,
            Timing,
            SectionID,
            ClassLocationID: Class_Room,
        };
        await schedule.addClass(classData);
        const htmlResponse = `
        <html>
          <body>
            <script>
              alert("Class Scheduled Successfully ! !");
              window.location.href = "/faculty/dashboard";
            </script>
          </body>
        </html>
    `;
        res.send(htmlResponse);
    } catch (error) {
        console.error('Error adding class:', error);
        return res.status(500).send(`
        <html>
          <body>
            <script>
              alert("${error}. Please try again later.");
              window.location.href = "/faculty/dashboard";
            </script>
          </body>
        </html>
    `);
    }
};
exports.generateAttendanceZip = async (req, res) => {
    try {
        const facultyEmail = req.session.email;
        const selectedDate = req.body.date;
        const attendanceData = await attendance.getAttendanceByDateAndFaculty(
            facultyEmail,
            selectedDate,
        );

        // Create a new workbook
        const workbook = new Excel.Workbook();

        // Group the results by class timing
        const groupedByTiming = {};
        attendanceData.forEach((row) => {
            if (!groupedByTiming[row.Timing]) {
                groupedByTiming[row.Timing] = [];
            }
            groupedByTiming[row.Timing].push(row);
        });

        // Create a worksheet for each timing group
        for (const timing in groupedByTiming) {
            if (groupedByTiming.hasOwnProperty(timing)) {
                const classRows = groupedByTiming[timing];
                const firstRow = classRows[0];

                const worksheetName = `${firstRow.Section}_${firstRow.Timing}-${
                    parseInt(firstRow.Timing) + 1
                }_${firstRow.Subject}_${firstRow.ClassLocation}`;
                const worksheet = workbook.addWorksheet(worksheetName);

                // Add headers
                const headers = ['StudentName', 'StudentEmail', 'AttendanceStatus'];
                worksheet.addRow(headers);

                // Add data rows
                classRows.forEach((row) => {
                    const rowData = headers.map((header) => row[header]);
                    worksheet.addRow(rowData);
                });

                // Auto-adjust column widths
                worksheet.columns.forEach((column) => {
                    let maxLength = 0;
                    column.eachCell({ includeEmpty: true }, (cell) => {
                        maxLength = Math.max(maxLength, (cell.value || '').toString().length);
                    });
                    column.width = maxLength < 10 ? 10 : maxLength + 2;
                });
            }
        }

        // Generate the Excel buffer and send as response
        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="attendance_${selectedDate}.xlsx"`,
        );
        res.status(200).send(buffer);
        console.log('Attendance sent successfully.');
    } catch (error) {
        console.error('Error generating attendance file:', error);
        res.status(500).send('Error generating attendance report');
    }
};

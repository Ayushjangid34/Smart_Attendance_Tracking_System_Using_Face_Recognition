const db = require('../config/db');
const attendance = {
    getAttendanceByDateAndFaculty: (facultyEmail, date) => {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT 
          Students.Name AS StudentName,
          Students.Email AS StudentEmail,
          Sections.SectionName AS Section,
          Classes.SubjectName AS Subject,
          Classes.ClassLocationID AS ClassLocation,
          Classes.Timing AS Timing,
          CASE WHEN Attendance.IsPresent THEN 'Present' ELSE 'Absent' END AS AttendanceStatus
        FROM 
          Classes
        JOIN 
          Faculties ON Classes.FacultyID = Faculties.Email
        JOIN 
          Sections ON Classes.SectionID = Sections.SectionID
        JOIN 
          Students ON Sections.SectionID = Students.SectionID
        LEFT JOIN 
          Attendance ON Classes.ClassID = Attendance.ClassID AND Attendance.StudentID = Students.Email
        WHERE 
          Faculties.Email = ? 
        AND 
          DATE(Classes.DateScheduled) = DATE(?)
        ORDER BY 
          Sections.SectionName ASC, Students.Name ASC, Classes.Timing ASC;
      `;
            db.query(query, [facultyEmail, date], (err, results) => {
                if (err) return reject(err); // Reject promise if error occurs
                resolve(results); // Resolve with results
            });
        });
    },
};

module.exports = attendance;

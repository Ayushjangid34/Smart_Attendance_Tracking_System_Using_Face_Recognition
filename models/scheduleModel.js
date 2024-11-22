const db = require('../config/db');
const schedule = {
    getStudentScheduleByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT Classes.SubjectName, 
                       Faculties.Name AS FacultyName, 
                       Classes.ClassLocationID, 
                       Classes.Timing, 
                       Attendance.IsPresent 
                FROM Classes 
                JOIN Faculties ON Classes.FacultyID = Faculties.Email 
                JOIN Sections ON Classes.SectionID = Sections.SectionID 
                JOIN Students ON Sections.SectionID = Students.SectionID 
                AND Students.Email = ? 
                AND Students.BranchID = Faculties.BranchID 
                LEFT JOIN Attendance ON Classes.ClassID = Attendance.ClassID 
                AND Attendance.StudentID = ? 
                WHERE DATE(DateScheduled) = CURDATE() 
                ORDER BY Timing ASC;
            `;
            db.query(query, [email, email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    getScheduleByFacultyEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT * 
            FROM Classes 
            JOIN Sections ON Classes.SectionID = Sections.SectionID 
            WHERE FacultyID = ? 
            AND DATE(DateScheduled) = CURDATE() 
            ORDER BY Timing ASC;
          `;
            db.query(query, [email], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },
    // Add a class
    addClass: (classData) => {
        const { FacultyID, SubjectName, DateScheduled, Timing, SectionID, ClassLocationID } =
            classData;
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO Classes (FacultyID, SubjectName, DateScheduled, Timing, SectionID, ClassLocationID) VALUES (?, ?, ?, ?, ?, ?);',
                [FacultyID, SubjectName, DateScheduled, Timing, SectionID, ClassLocationID],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results); // Return the results of the insert query
                },
            );
        });
    },
};

module.exports = schedule;

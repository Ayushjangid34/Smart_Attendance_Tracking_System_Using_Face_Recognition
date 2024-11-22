// models/Student.js
const db = require('../config/db');

const student = {
    getByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query =
                'SELECT * FROM Students JOIN Sections ON Students.SectionID = Sections.SectionID JOIN Branches ON Students.BranchID = Branches.BranchID WHERE Email = ?;';
            db.query(query, [email], (err, results) => {
                if (err) return reject(err); // Reject promise with error
                if (results.length === 0) return resolve(null); // Resolve with null if no student found
                resolve(results[0]); // Resolve with student data
            });
        });
    },
    // Method to fetch all students along with their section and branch details
    getAllStudents: () => {
        return new Promise((resolve, reject) => {
            const query =
                'SELECT * FROM Students JOIN Sections ON Students.SectionID = Sections.SectionID JOIN Branches ON Students.BranchID = Branches.BranchID;';
            db.query(query, (err, results) => {
                if (err) return reject(err); // Reject the promise if there is an error
                resolve(results); // Resolve with the fetched student data
            });
        });
    },
    // Create a new student
    create: (studentData) => {
        return new Promise((resolve, reject) => {
            const { Student_Name, Email, BranchID, SectionID, password, phone, DOB } = studentData;
            // Try to insert the student into the Students table
            db.query(
                'INSERT INTO Students (Name, Email, BranchID, SectionID, Password, Phone, DOB) VALUES (?, ?, ?, ?, ?, ?, ?);',
                [Student_Name, Email, BranchID, SectionID, password, phone, DOB],
                (err, results) => {
                    if (err) return reject(err); // Reject with the general error
                    resolve(results); // Resolve with the result of the insert operation
                },
            );
        });
    },
};

module.exports = student;

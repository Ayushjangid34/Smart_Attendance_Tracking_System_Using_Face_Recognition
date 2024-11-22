const db = require('../config/db');

const faculty = {
    // Method to fetch all faculties and their associated branches
    getByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query =
                'SELECT * FROM Faculties JOIN Branches ON Faculties.BranchID = Branches.BranchID WHERE Email = ?;';
            db.query(query, [email], (err, results) => {
                if (err) return reject(err); // Reject promise with error
                if (results.length === 0) return resolve(null); // Resolve with null if no student found
                resolve(results[0]); // Resolve with student data
            });
        });
    },
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query =
                'SELECT * FROM Faculties JOIN Branches ON Faculties.BranchID = Branches.BranchID;';
            db.query(query, (err, results) => {
                if (err) return reject(err); // Reject the promise if there is an error
                resolve(results); // Resolve with the fetched data
            });
        });
    },
    create: (facultyData) => {
        return new Promise((resolve, reject) => {
            const { Email, Name, BranchID, password, phone } = facultyData;

            // Try to insert the faculty into the Faculties table
            db.query(
                'INSERT INTO Faculties (Email, Name, BranchID, Password, Phone) VALUES (?, ?, ?, ?, ?);',
                [Email, Name, BranchID, password, phone],
                (err, results) => {
                    if (err) return reject(err); // Reject with the general error
                    resolve(results); // Resolve with the result of the insert operation
                },
            );
        });
    },
};
module.exports = faculty;

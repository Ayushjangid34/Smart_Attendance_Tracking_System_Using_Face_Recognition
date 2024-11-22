const attendance = require('./attendanceModel');
const faculty = require('./facultyModel');
const schedule = require('./scheduleModel');
const student = require('./studentModel');

module.exports = {
    student,
    faculty,
    schedule,
    attendance,
};

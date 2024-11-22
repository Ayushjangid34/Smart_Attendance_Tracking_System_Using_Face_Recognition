require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const db = require("./config/db");

let underObservence = [];
let now = new Date();
function checkScheduledClasses() {
    now = new Date();
    console.log(now.getMinutes());
    if (now.getMinutes() === 0) underObservence = [];
    db.query(
        'SELECT * FROM Classes WHERE DateScheduled = DATE(CURDATE()) AND Timing = ?;',
        [now.getHours()],
        (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return;
            }
            results.forEach((schedule) => {
                if (!underObservence.includes(schedule.ClassID)) {
                    underObservence.push(schedule.ClassID);
                    //funtion to observer class
                    let childProcess = exec(
                        process.env.PYTHON_RUN +' ' + path.join(__dirname, 'faceRecognition', 'trackClass.py'),
                        (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.error(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout:\n${stdout}`);
                        },
                    );
                    // Pass input to the child process
                    childProcess.stdin.write(schedule.ClassID.toString());
                    childProcess.stdin.end(); // Close the input stream
                }
            });
            console.log('Database results:', results);
        },
    );
}
// Setting interval to run the checkDatabase function every 5 seconds
setInterval(checkScheduledClasses, 5000);

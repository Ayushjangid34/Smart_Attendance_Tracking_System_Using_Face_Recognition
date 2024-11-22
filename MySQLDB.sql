DROP DATABASE IF EXISTS attendance_tracking;
create database attendance_tracking;
use attendance_tracking;
CREATE TABLE Admins (
    Email VARCHAR(100) UNIQUE NOT NULL,
    AdminName VARCHAR(100) NOT NULL,
    Password BLOB NOT NULL -- BLOB because in future we can consider storing Hashed Password
);

insert into Admins ( AdminName, Email, Password ) values ( "Ayush Jangid" , "ayush.admin@poornima.org" , "123" ); -- You can insert something else according to you, but keep in mind, this is the only Admin who is entry to this project ( i.e. Atleat we need one Admin to access the system ! ! ! )
-- use upper command to insert more Admins




CREATE TABLE Branches (
    BranchID INT PRIMARY KEY AUTO_INCREMENT,
    BranchName VARCHAR(100) NOT NULL
    -- Add other relevant fields as needed
);



insert into Branches (BranchName) values ("Computer Science");
insert into Branches (BranchName) values ("Information Technology");
insert into Branches (BranchName) values ("Civil");
insert into Branches (BranchName) values ("Electronics and Communication");
insert into Branches (BranchName) values ("Machenical");

CREATE TABLE Sections (
    SectionID INT PRIMARY KEY AUTO_INCREMENT,
    SectionName VARCHAR(100) NOT NULL
);
insert into Sections (SectionName) values ("A");
insert into Sections (SectionName) values ("B");
insert into Sections (SectionName) values ("C");
insert into Sections (SectionName) values ("D");

CREATE TABLE Faculties (
    Email VARCHAR(100) UNIQUE NOT NULL,
    Name VARCHAR(100) NOT NULL,
    BranchID INT,
    Password BLOB NOT NULL,
    Phone VARCHAR(15),
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID) ON DELETE SET NULL
);


CREATE TABLE Students (
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    BranchID INT,
    SectionID INT,
    Password BLOB NOT NULL,
    Phone VARCHAR(15),
    DOB DATE,
    encoding blob,
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID),
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID)
);

CREATE TABLE Classes (
    ClassID INT PRIMARY KEY AUTO_INCREMENT,
    FacultyID VARCHAR(100),
    SubjectName VARCHAR(100) NOT NULL,
    DateScheduled DATE NOT NULL,
    Timing INT NOT NULL,
    SectionID INT,
    ClassLocationID VARCHAR(100) NOT NULL,
    FOREIGN KEY (FacultyID) REFERENCES Faculties(Email) on delete cascade,
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID) on delete cascade,
    UNIQUE (FacultyID, DateScheduled, Timing) 
);


CREATE TABLE Attendance (
    ClassID INT,
    StudentID VARCHAR(100),
    IsPresent BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (ClassID) REFERENCES Classes(ClassID) ON DELETE CASCADE,
    FOREIGN KEY (StudentID) REFERENCES Students(Email) ON DELETE CASCADE
);


CREATE TABLE CameraID (
    ClassRoomID VARCHAR(100),
    CameraID INT
);

insert into CameraID ( ClassRoomID , CameraID) values ( "CS-A" , 1 );
insert into CameraID ( ClassRoomID , CameraID) values ( "CS-B" , 2 );
insert into CameraID ( ClassRoomID , CameraID) values ( "CS-C" , 3 );
insert into CameraID ( ClassRoomID , CameraID) values ( "CS-D" , 4 );
-- Currently we are using laptop cameras to access the video, but in production these numeric values can be URL that indicates a static IP camera that are installed in classrooms





DELIMITER $$
CREATE TRIGGER insert_attendance_trigger AFTER INSERT ON Classes
FOR EACH ROW
BEGIN
    -- Insert attendance records for all students in the same section as the newly inserted class
    INSERT INTO Attendance (ClassID, StudentID, IsPresent)
    SELECT NEW.ClassID, Students.Email, FALSE
    FROM Students
    JOIN Sections ON Students.SectionID = Sections.SectionID
    JOIN Faculties ON NEW.FacultyID = Faculties.Email
    WHERE Sections.SectionID = NEW.SectionID
    AND Students.BranchID = Faculties.BranchID;
END$$
DELIMITER ;

CREATE TABLE sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(100) NOT NULL,
  data TEXT,
  session_role ENUM('admin','student','faculty') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);


SET GLOBAL event_scheduler = ON;

CREATE EVENT delete_expired_sessions -- In database event to perform a cron job for cleaning database for expired sessions
ON SCHEDULE EVERY 10 minute  -- Adjust the frequency as needed
DO
DELETE FROM sessions WHERE expires_at <= NOW();


CREATE TABLE helpRegister (
  reason TEXT,
  seeker_email VARCHAR(100) NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT 'SCRIPT EXECUTED SUCCESSFULLY, COPY THE DATABASE NAME FOR CONFIG AND ADMIN CREDENTIALS FOR INITIAL LOGIN ! ! !'; 
SELECT DATABASE();
SELECT * FROM Admins;



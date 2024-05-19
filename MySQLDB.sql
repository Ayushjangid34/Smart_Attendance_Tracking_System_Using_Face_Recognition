SHOW DATABASES;
drop database attendance_tracking;
create database attendance_tracking;
use attendance_tracking;
CREATE TABLE Admins (
    Email VARCHAR(100) UNIQUE NOT NULL,
    AdminName VARCHAR(100) NOT NULL,
    Password VARCHAR(50) NOT NULL
);

insert into Admins ( AdminName, Email, Password ) values ( "Ayush Jangid" , "ayush@admin.org" , "123" );

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
    Password VARCHAR(50) NOT NULL,
    Phone VARCHAR(15),
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID) ON DELETE SET NULL
);


CREATE TABLE Students (
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    BranchID INT,
    SectionID INT,
    Password VARCHAR(50) NOT NULL,
    Phone VARCHAR(15),
    DOB DATE,
    encoding blob,
    FOREIGN KEY (BranchID) REFERENCES Branches(BranchID) ON DELETE SET NULL,
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID) ON DELETE SET NULL
);

CREATE TABLE Classes (
    ClassID INT PRIMARY KEY AUTO_INCREMENT,
    FacultyID VARCHAR(100),
    SubjectName VARCHAR(100) NOT NULL,
    DateScheduled DATE NOT NULL,
    Timing INT NOT NULL,
    SectionID INT,
    ClassLocationID VARCHAR(100) NOT NULL,
    FOREIGN KEY (FacultyID) REFERENCES Faculties(Email) ON DELETE SET NULL,
    FOREIGN KEY (SectionID) REFERENCES Sections(SectionID) ON DELETE SET NULL
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
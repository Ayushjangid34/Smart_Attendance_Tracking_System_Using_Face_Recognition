# Smart Attendance Tracking System Using Face Recognition

## Description
This is my final year project, called __Smart Attendance Tracking System__, which uses face recognition technology to automate and streamline the process of recording attendance in educational institutions. The project includes various roles, such as __admin__, __faculty__, and __student__, each with specific functionalities. The repository includes [`index.js`](index.js ), which serves as the entry point for the project (i.e., the server), [`attendanceServer.js`](attendanceServer.js), which observes the scheduled class and start the attendance recording by launching/execution [`faceRecognition/trackClass.py`](faceRecognition/trackClass.py) in real-time. Additionally, there is a [`MySQLDB.sql`](MySQLDB.sql ) file that can be used to set up the MySQL database.

## Problem It Solves
Traditional attendance tracking methods are often time-consuming, prone to errors, and can be easily manipulated. This project addresses these issues by using face recognition technology to automate the attendance process, ensuring accuracy, efficiency, and security.

## Key Components of the Project
This project utilizes the **MVC** architecture, and the code is written in a structured approach that adheres to the **DRY** (Don't Repeat Yourself) principle, resulting in more manageable and maintainable code. These are the main components of the project:  
- **Controllers**: Handle the logic for various parts of the application.
- **Models**: Interact with the database to manage data.
- **Routes**: Define the API endpoints and link them to the corresponding controllers.
- **Middlewares**: Handle tasks such as authorization, session management, and input validation.
- **Utilities**: Provide helper functions for tasks like encryption, session creation, etc.
- **Views**: Contain HTML and CSS files for the front end of the application.
- **faceRecognition**: Contains `.py` files that perform student face encoding and track the presence of students in a class.

## Features

- **Integrates Two Different Technology**: This project uses `Node.js` for Backend with `Express` framework and `Python` for Face Recognition and Machine Learning tasks, I integrated both tech to work together in order to achieve this project.

- **Face Recognition**: Uses face recognition technology to automate attendance tracking.
  
- **User Authentication**: Implements user authentication and role-based access control for admin, faculty, and students.

- **Database Integration**: Integrates with a MySQL database to manage user data, attendance records, and schedules.

- **Admin Dashboard**: Allows admins to register students and faculty, view registered users, and manage the system.

- **Faculty Dashboard**: Allows faculty to schedule classes, view their schedule, and download attendance reports.

- **Student Dashboard**: Allows students to view their schedule, update their profile, and upload their photos for face recognition.

- **Real-Time Processing**: Includes real-time processing for attendance tracking.

- **Allow valid photo uploads only**: This feature doesn't allow students to upload fake photos like group photos with multiple faces, photos with no face, or blurry photos to confuse the system. This feature only allows students to upload/modify photos if they contain a single face.

## Future Scope of Project

- **Enhanced Proxy Prevention Mechanism**: A feature can be developed that validates photo uploads by students to ensure they cannot upload someone else's photo for proxy attendance.
  
- **Class Environment Analysis**: In the future, we can implement a Machine Learning model to assess the class environment. The model can monitor student focus, engagement, and behavior to provide a class rating, ensuring students take the sessions seriously.
- 

## Project System Design

<div align="center">
  <img src="https://raw.githubusercontent.com/Ayushjangid34/Smart_Attendance_Tracking_System_Using_Face_Recognition/main/SysDesign.jpg" alt="System design image link">
</div>



## Watch the Demo Video

<div align="center">
  <a href="https://www.youtube.com/watch?v=cgQspYHmSPI">
    <img src="https://img.youtube.com/vi/cgQspYHmSPI/0.jpg" alt="Watch the video">
  </a>
</div>






## Setup Instructions

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v18.20.4)
- **npm** (10.7.0)
- **MySQL** (8.4.3)
- **Python** (3.x)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Ayushjangid34/Smart_Attendance_Tracking_System_Using_Face_Recognition.git
   ```

2. **Go to Project Directory:**

   ```bash
   cd Smart_Attendance_Tracking_System_Using_Face_Recognition
   ```

3. **Create the Database:** Execute the provided SQL script [`MySQLDB.sql`](MySQLDB.sql) to create the MySQL database. You can do this using a MySQL GUI client like Workbench or using the command provided below.

   > **NOTE:** This command will drop the `attendance_tracking` database every time it is executed. If you are an existing user, running this command will destroy all your data and set up a new database. Please execute it wisely.

   ```bash
   mysql -u <username> -p < MySQLDB.sql
   ```

4. **Configure Environment Variables:**
    Edit [`.env`](.env) file according to your local setup using any text editor or IDE:

    ```properties
    # Database Configuration
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=attendance_tracking
    DB_PORT=3306

    # Encryption Key
    ENCRYPTION_SECRET=yourencryptionkey

    # Other Environment Variables
    SERVER_PORT=3000

    # Python Interpreter (adjust based on OS)
    PYTHON_RUN=python  # For Windows or Anaconda environment, or use 'python3' for Linux or Mac
    ```

5. **Install Dependencies:** Open your terminal and run the following commands:

   ```bash
   npm install
   ```

   ```bash
   pip install -r pyRequirements.txt
   ```

6. **Start the Server:** To run the server, execute:

   ```bash
   npm start
   ```

7. **Start the Attendance Server:** To run the attendance server, execute:

   ```bash
   node attendanceServer.js
   ```

## Additional Points to Keep in Mind
- This project doesn't store passwords in hashed format because the admin inserted during database creation is the only administrator who can log in. That's why, for simplicity, we are using plain text instead of hashed passwords.
- You can add more administrators by running the following SQL command:

  ```sql
   insert into Admins ( AdminName, Email, Password ) values ( "<admin name>" , "<admingmailid>" , "<adminpassword>" ); 
   ```

Feel free to ask queries! 😊
## Contact Me

Feel free to reach out to me through any of the following contact methods:

- **Mobile**: [📞 +917568983187](tel:+917568983187)
- **LinkedIn**: [https://www.linkedin.com/in/ayushjangid34](https://www.linkedin.com/in/ayushjangid34)
- **Gmail**: [contact.ayushjangid@gmail.com](mailto:contact.ayushjangid@gmail.com)

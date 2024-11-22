import mysql.connector
from dotenv import load_dotenv
import os
load_dotenv()

# Establishing a connection to the MySQL database
connection = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME'),
     port=os.getenv('DB_PORT'),
    autocommit=True
)

# Checking if the connection is successful
if connection.is_connected():
    print("Connected to MySQL database")

const { error } = require('console');
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;
// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MarkMaxx2#',
  database: 'verification'
});
// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});
// close the MySQL connection
// connection.end();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/generate-qr-code', (req, res) => {
    const { studentId, studentName, phoneNumber, email } = req.body;

    const sql = 'INSERT INTO students (student_id, student_name, phone_number, email) VALUES (?, ?, ?, ?)';
    const values = [studentId, studentName, phoneNumber, email];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting student data: ', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('QR Code generated successfully');
    });
});

app.get('/verify', (req, res) => {
    const { studentId } = req.query;

    const sql = 'SELECT * FROM students WHERE student_id = ?';
    
    connection.query(sql, studentId, (err, result) => {
        if (err) {
            console.error('Error querying database: ', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Student not found');
            return;
        }
        // Add verification logic here
            // Define a list of valid student IDs for MMUK
    const validStudentIds = [];

    // Generate registration numbers for fourth-year students (2020)
    for (let i = 1; i <= 99; i++) {
        const studentId = `SCT-253-${('00' + i).slice(-3)}/2020`;
        validStudentIds.push(studentId);
    }

    // Generate registration numbers for third-year students (2021)
    for (let i = 1; i <= 99; i++) {
        const studentId = `SCT-253-${('00' + i).slice(-3)}/2021`;
        validStudentIds.push(studentId);
    }

    // Generate registration numbers for second-year students (2022)
    for (let i = 1; i <= 99; i++) {
        const studentId = `SCT-253-${('00' + i).slice(-3)}/2022`;
        validStudentIds.push(studentId);
    }

    // Generate registration numbers for first-year students (2023)
    for (let i = 1; i <= 99; i++) {
        const studentId = `SCT-253-${('00' + i).slice(-3)}/2023`;
        validStudentIds.push(studentId);
    }

    // Verify if the provided student ID is in the list of valid IDs
    const isMemberOfMMUK = validStudentIds.includes(studentId);

    // Display verification status
    const verificationStatusElement = document.createElement('p');
    if (isMemberOfMMUK) {
      verificationStatusElement.textContent = `Student ${studentName} with ID ${studentId} is a verified member of Multimedia University of Kenya.`;
      verificationStatusElement.style.color = 'green';
    } else {
      verificationStatusElement.textContent = `Student ${studentName} with ID ${studentId} is not a verified member of Multimedia University of Kenya.`;
      verificationStatusElement.style.color = 'red';
    }
    document.body.appendChild(verificationStatusElement);
 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// process.on('SIGINT', () => {
//     console.log('Closing MySQL connection');
//     connection.end();
//     process.exit();
// });

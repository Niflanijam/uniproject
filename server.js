
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); 
const bcrypt = require('bcrypt');
const connectDB = require('./dbconnect'); 
const connectadd =require('./dbconnect');
const User = require('./models/User'); 
const  Student =require('./models/student');
const PDFDocument = require('pdfkit');
const session = require('express-session');











const app = express();
const port =3001;
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index2.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index3.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index4.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'qr.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'addnew.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'student.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'attendance.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'studentform.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'deletestudent.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'qrscan.html')); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'qrgen.html')); });


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


connectDB();
connectadd();



app.post('/register', async (req, res) => {
  try {
      if (!req.body.username || !req.body.email || !req.body.password) {
          return res.status(400).json({ message: 'Missing username, email, or password' });
      }

      const hash = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash,
      });

      await newUser.save();

      res.status(201).json({ message: 'Successfully registered' });
  } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
          return res.status(400).json({ message: 'Email already registered' });
      } else if (err.keyPattern && err.keyPattern.password) {
          return res.status(400).json({ message: 'Password already taken' });
      }

      console.error('Error occurred while registering:', err);
      res.status(500).json({ message: 'Error occurred while registering' });
  }
});



app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Missing username or password');
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }
  
          
    res.redirect('/html/home/index4.html'); 

  } catch (err) {
    console.error('Error occurred during login:', err);
    res.status(500).send('Error occurred during login');
  }
});


app.use(session({
  secret: '1234#',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error('Logout error:', err);
          return res.status(500).send('Logout failed');
      }
      res.clearCookie('connect.sid'); 
      res.redirect('/login');
  });
});



app.get('/login', (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); 
  res.sendFile(path.join(__dirname, 'public','html','login','index3.html')); 
});


function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated, proceed
  } else {
    res.redirect('/login'); 
  }
}

// Example of a protected route
app.get('/home', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'home', 'index4.html'));
});

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});




app.post('/student', async (req, res) => {
 
  const { Name, Index, Reg, batch } = req.body;

  if (!Name || !Index || !Reg || !batch) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (batch !== '2019/2020') {
    return res.status(400).json({ message: 'Not Implemented for this batch' });
  }
  
  try {
   
    const existingStudent = await Student.findOne({ Index });
    const existingStudentReg = await Student.findOne({ Reg });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this index already exists' });
    }
    if (existingStudentReg) {
      return res.status(400).json({ message: 'Student with this registration number already exists' });
    }


  
    const newStudent = new Student({ Name, Index, Reg, batch });
    await newStudent.save();
  
   /* res.status(201).json({ message :'Student added successfully'});*/
   res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ message:'Failed to add student', error });
  }

});


app.get('/student', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error });
  }
});

app.get('/student-list', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'student', 'student.html'));
});




app.post('/delete', async (req, res) => {
  const { Index, Reg } = req.body;

  try {
    const student = await Student.findOne({ Index, Reg });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.deleteOne({ Index, Reg });
    res.status(200).json({ message: 'Student successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
});












app.use(express.static('public'));



app.post('/attend/:Index', async (req, res) => {
  const studentIndex = req.params.Index;
  try {
    const student = await Student.findOne({ Index: studentIndex });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.attended && student.Date) {
      const today = new Date().toISOString().split('T')[0];
      const attendanceDate = new Date(student.Date).toISOString().split('T')[0];
      if (attendanceDate === today) {
        return res.status(400).json({ message: 'Attendance already marked' });
      }
    }

    student.attended = true;
    student.attendanceDate = new Date();
    await student.save();

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark attendance', error });
  }
});

app.get('/student', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendance report', error });
  }
});


app.post('/reset-attendance', async (req, res) => {
  try {
      await Student.updateMany({ attended: true }, { $set: { attended: false, Date: null } });
      res.send('Attendance reset successfully');
  } catch (error) {
      console.error('Error resetting attendance:', error);
      res.status(500).send('Internal server error');
  }
});




app.get('/report-pdf', async (req, res) => {
  try {
    const doc = new PDFDocument();
    res.setHeader('Content-disposition', 'attachment; filename=attendance-report.pdf');
    res.setHeader('Content-type', 'application/pdf');
    
    doc.pipe(res);
    
    doc.fontSize(16).text('Attendance Report 2019/2020 Batch ', { align: 'center' });
    doc.moveDown();

    
    
    const tableTop = 120; // Adjust this value to add space between header and border
    const headerTop = tableTop + 10; 
    const columnWidths = [100, 100, 100, 100, 100]; // Column widths
    const rowHeight = 30;
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0); // Calculate table width

    // Draw table header
    
    
    const columnXPositions = [50];
    columnWidths.reduce((x, width) => {
      columnXPositions.push(x + width);
      return x + width;
    }, 50);
    
    
     
    doc.fontSize(12);
    doc.text('Name', 60, headerTop);
    doc.text('Index', 160, headerTop);
    doc.text('Reg Number', 260, headerTop);
    doc.text('Batch', 360, headerTop);
    doc.text('Date', 460, headerTop);
    doc.moveDown();

    // Draw table rows
    const attendedStudents = await Student.find({ attended: true });

    attendedStudents.forEach((student, index) => {
      const yPosition = tableTop + rowHeight + (index * rowHeight);
      const formattedDate = student.Date ? new Date(student.Date).toLocaleDateString() : 'Not Available';
       
      // Draw row background
      doc.rect(50, yPosition, tableWidth, rowHeight)
         .fillColor(index % 2 === 0 ? '#d5d5d5' : '#d5d5d5') // Alternating row colors
         .fill()
         .fillColor('#d5d5d5') ;
          
      // Draw text

      doc.fillColor('#000000')
         .fontSize(10)
         .text(student.Name, 60, yPosition + 5, { width: columnWidths[0], align: 'left' })
         .text(student.Index, 160, yPosition + 5, { width: columnWidths[1], align: 'left' })
         .text(student.Reg, 260, yPosition + 5, { width: columnWidths[2], align: 'left' })
         .text(student.batch, 360, yPosition + 5, { width: columnWidths[3], align: 'left' })
         .text(formattedDate, 460, yPosition + 5, { width: columnWidths[4], align: 'left' });

      // Draw row border
      doc.strokeColor('#000000') // Black border color
         .lineWidth(1)
         .rect(50, yPosition, tableWidth, rowHeight)
         .stroke();
    });

    doc.strokeColor('#000000') // Black border color
    .lineWidth(1);
 columnXPositions.forEach((x, i) => {
   if (i > 0) {
     doc.moveTo(x, tableTop)
        .lineTo(x, tableTop + (attendedStudents.length * rowHeight) + rowHeight)
        .stroke();
   }
 });
    // Draw table bottom border
    const totalHeight = tableTop + rowHeight + (attendedStudents.length * rowHeight);
    doc.strokeColor('#001') // Black border color
       .lineWidth(1)
       .rect(50, tableTop, tableWidth, totalHeight - tableTop)
       .stroke();
    
    // End the PDF document
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (!res.headersSent) { // Check if headers have been sent before sending an error response
      res.status(500).send('Internal server error');
    }
  }
});










app.post('/attendance', async (req, res) => {
  try {
      const studentIndex = req.body.index;
      console.log(`Received index: ${studentIndex}`);

      const student = await Student.findOne({ Index: studentIndex });

      if (student) {
          if (!student.attended) {
              student.attended = true;
              student.Date = new Date();
              await student.save();
              res.status(200).json({ message: 'Attendance successfully recorded' });
          } else {
              res.status(200).json({ message: 'Attendance already recorded' });
          }
      } else {
          res.status(404).json({ message: 'Invalid student index' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error processing attendance', error });
  }
});






app.post('/save-qr-code', async (req, res) => {
  const { index, image } = req.body;

  if (!index || !image) {
      return res.status(400).json({ message: 'Missing index or image data' });
  }

  const base64Data = image.replace(/^data:image\/png;base64,/, '');

  try {
      let student = await Student.findOne({ Index: index });

      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      student.qrCode = Buffer.from(base64Data, 'base64');
      await student.save();

      res.status(200).json({ message: `QR code for student ${index} saved successfully` });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to save QR code' });
  }
});

































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































//mongoose.connect('mongodb://localhost:27017/genarate', { useNewUrlParser: true, useUnifiedTopology: true });


/**app.post('/genarate', async (req, res) => {
  try {
    const db = client.db('qrgenarate'); // Replace with your actual database name
    const collection = db.collection('genarate'); // Collection to store registrations
    const result = await collection.insertOne(req.body); // Insert form data into MongoDB
    res.status(201).send('genaration successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('genaration failed');
  }
});

**/
































app.use(express.static(path.join(__dirname, 'public')));


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




////index3.html












































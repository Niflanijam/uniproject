const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Index: { type: String, required: true, unique: true },
  Reg: { type: String, required: true, unique: true },
  batch: { type: String, required: true },
  attended: { type: Boolean, default: false } ,
  Date: { type: Date },
  qrCode: { type: Buffer } 

  
});



const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;

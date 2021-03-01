const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const TeacherSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  stuId: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  permission: {
    type: String,
    default: 'admin'
  }
})

module.exports = Teacher = mongoose.model('teacher', TeacherSchema)
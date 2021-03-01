const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const ClassSchema = new Schema({
  user: {     //关联数据表
    type: String,
    ref: 'userapps',
    required: true
  },
  // 院系
  college: {
    type: String,
    required: true
  },
  mon: [
    {
      // 课程名
      name: {
        type: String,
        default: '暂无课程'
      },
      // 任课教师
      teacher: {
        type: String,
        default: ''
      },
      // 上课地点
      classRoom: {
        type: String,
        default: ''
      },
      // 开课时间
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        default: '00:00'
      },
      end: {
        type: String,
        default: '00:00'
      }
    }
  ],
  tue: [
    {
      // 课程名
      name: {
        type: String,
        default: '暂无课程'
      },
      // 任课教师
      teacher: {
        type: String,
        default: ''
      },
      // 上课地点
      classRoom: {
        type: String,
        default: ''
      },
      // 开课时间
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        default: '00:00'
      },
      end: {
        type: String,
        default: '00:00'
      }
    }
  ],
  wed: [
    {
      // 课程名
      name: {
        type: String,
        default: '暂无课程'
      },
      // 任课教师
      teacher: {
        type: String,
        default: ''
      },
      // 上课地点
      classRoom: {
        type: String,
        default: ''
      },
      // 开课时间
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        default: '00:00'
      },
      end: {
        type: String,
        default: '00:00'
      }
    }
  ],
  thu: [
    {
      // 课程名
      name: {
        type: String,
        default: '暂无课程'
      },
      // 任课教师
      teacher: {
        type: String,
        default: ''
      },
      // 上课地点
      classRoom: {
        type: String,
        default: ''
      },
      // 开课时间
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        default: '00:00'
      },
      end: {
        type: String,
        default: '00:00'
      }
    }
  ],
  fri: [
    {
      // 课程名
      name: {
        type: String,
        default: '暂无课程'
      },
      // 任课教师
      teacher: {
        type: String,
        default: ''
      },
      // 上课地点
      classRoom: {
        type: String,
        default: ''
      },
      // 开课时间
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        default: '00:00'
      },
      end: {
        type: String,
        default: '00:00'
      }
    }
  ],
  sat: [
    {
      // 课程名
      name: {
        type: String,
        default: '暂无课程'
      },
      // 任课教师
      teacher: {
        type: String,
        default: ''
      },
      // 上课地点
      classRoom: {
        type: String,
        default: ''
      },
      // 开课时间
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        default: '00:00'
      },
      end: {
        type: String,
        default: '00:00'
      }
    }
  ],
  sun: [
    {
      // 课程名
      name: {
        type: String,
        default: '暂无课程'
      },
      // 任课教师
      teacher: {
        type: String,
        default: ''
      },
      // 上课地点
      classRoom: {
        type: String,
        default: ''
      },
      // 开课时间
      quantum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      begin: {
        type: String,
        default: '00:00'
      },
      end: {
        type: String,
        default: '00:00'
      }
    }
  ],
})

module.exports = Class = mongoose.model('class', ClassSchema)
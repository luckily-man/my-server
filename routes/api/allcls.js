const Router = require('koa-router');
const allCls = require('../../models/allCls');
const router = new Router()
const AllCls = require('../../models/allCls')

/*
*@router GET  api/allcls/test
@desc 测试接口地址
@access  接口是公开的
*/

router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'user works..'
  }
})

/*
*@router GET  api/allcls/add
@desc 添加课程（院系）接口
@access  接口是公开的
*/

router.post('/add', async ctx => {
  const newAllCls = new AllCls({
    college: ctx.request.body.college
  })
  await newAllCls.save().then(res => {
    ctx.body = {
      status: 200,
      res
    }
  }).catch(err => {
    ctx.body = {
      status: 404,
      err
    }
  })
})

/*
*@router GET  api/allcls/add/course
@desc 添加课程（课程）接口
@access  接口是公开的
*/

router.post('/add/course', async ctx => {
  const college = ctx.request.body.college
  const result = await AllCls.find({college})
  if(result.length > 0) {
    const newCourse = {
      name: ctx.request.body.name,
      teacher: ctx.request.body.teacher,
      classRoom: ctx.request.body.classRoom,
      quantum: ctx.request.body.quantum,
      week: ctx.request.body.week,
      begin: ctx.request.body.begin,
      end: ctx.request.body.end,
    }
    const profile = await AllCls.updateOne(
      {college:ctx.request.body.college},
      {$push: {course:newCourse}},
      {new: true}
    )
    if(profile.ok == 1) {
      const findResult = await AllCls.find({college: college})
      ctx.body = {
        status: 200,
        data: findResult
      }
    }
  } else {
    ctx.body = {
      status: 404,
      msg: '没有任何数据'
    }
  }
})

/*
*@router POST  api/allcls/add/student
@desc 添加学生接口
@access  接口是公开的
*/

router.post('/add/student', async ctx => {
  const finsResult = await AllCls.find({college: ctx.request.body.college})
  let classname = finsResult[0].course.filter(item=> {
    if(item.name  == ctx.request.body.name && item.teacher == ctx.request.body.teacher && item.week == ctx.request.body.week) {
      return item
    }
  })
  if(classname.length > 0) {
    let newStudents = {}
    newStudents.ontime = []
    if(ctx.request.body.stuName) newStudents.stuName = ctx.request.body.stuName
    if(ctx.request.body.stuId) newStudents.stuId = ctx.request.body.stuId
    let stuResult = classname[0].students.filter(item => {
      if(item.stuName == ctx.request.body.stuName) {
        return item
      }
    })
    if(stuResult.length > 0) {
      ctx.body = {
        statsu: 404,
        data: '已加入课程'
      }
    } else {
      classname[0].students.unshift(newStudents)
      const courseResult = await AllCls.updateOne(
        {college:ctx.request.body.college},
        {$set: {course:finsResult[0].course}},
        {new: true}
      )
      if(courseResult.ok == 1) {
        ctx.body = {
          status: 200,
          data: finsResult[0].course
        }
      }else {
        ctx.body = {
          status: 404,
          data: '添加失败'
        }
      }
    }
  } else {
    ctx.body = {
      status: 404,
      data: '加入课程错误，未找到课程'
    }
  }
})


/*
*@router POST  api/allcls/ding/ontime
@desc 签到接口
@access  接口是公开的
*/

router.post('/ding/ontime', async ctx => {
  const finsResult = await AllCls.find({college: ctx.request.body.college})
  let classname = finsResult[0].course.filter(item=> {
    if(item.name  == ctx.request.body.name && item.teacher == ctx.request.body.teacher && item.week == ctx.request.body.week) {
      return item
    }
  })
  if(classname.length > 0) {
    let stuResult = classname[0].students.filter(item => {
      if(item.stuName == ctx.request.body.stuName && item.stuId == ctx.request.body.stuId) {
        return item
      }
    })
    if(stuResult.length > 0) {
      const newOntime = {}
      if(ctx.request.body.place) newOntime.place = ctx.request.body.place
      if(ctx.request.body.beginTime) newOntime.beginTime = ctx.request.body.beginTime
      if(ctx.request.body.endTime) newOntime.endTime = ctx.request.body.endTime
      if(ctx.request.body.date) newOntime.date = ctx.request.body.date
      const ontimeResult = stuResult[0].ontime
      if(ontimeResult.length > 0) {
        let uuid = 0
        const dateResult = ontimeResult.filter((item, index) => {
          if(item.date == ctx.request.body.date) {
            uuid = index
            return item
          }
        })
        // 2、签到未签退
        if(dateResult.length > 0) {
          if(ontimeResult[uuid].endTime == '没有签退') {
            ontimeResult[uuid].endTime = ctx.request.body.endTime
            const endResult = await AllCls.updateOne(
              {college:ctx.request.body.college},
              {$set: {course:finsResult[0].course}},
              {new: true}
            )
            if(endResult.ok == 1) {
              ctx.body = {
                status: 200,
                msg: '签退成功',
                data: stuResult[0].ontime
              }
            }
          } else {
            ctx.body = {
              status: 201,
              data: '此课程已签到',
              data: stuResult[0].ontime
            }
          }
         
        } else {
          stuResult[0].ontime.push(newOntime)
          const courseResult = await AllCls.updateOne(
            {college:ctx.request.body.college},
            {$set: {course:finsResult[0].course}},
            {new: true}
          )
          if(courseResult.ok == 1) {
            ctx.body = {
              status: 200,
              msg: '签到成功',
              data: stuResult[0].ontime
            }
          }
        }
      }else {
        // 1、从未签过到
        stuResult[0].ontime.unshift(newOntime)
        const courseResult = await AllCls.updateOne(
          {college:ctx.request.body.college},
          {$set: {course:finsResult[0].course}},
          {new: true}
        )
        if(courseResult.ok == 1) {
          ctx.body = {
            status: 200,
            msg: '签到成功',
            data: stuResult[0].ontime
          }
        }
      }
    } else {
      ctx.body = {
        status: 404,
        data: '尚未加入课程'
      }
    }
  } else {
    ctx.body = {
      status: 404,
      data: '加入课程错误，未找到课程'
    }
  }
})

/*
*@router POST  api/allcls/ding/select
@desc 查找是否签到接口
@access  接口是公开的
*/

router.post('/ding/select', async ctx => {
  const finsResult = await AllCls.find({college: ctx.request.body.college})
  
  let classname = finsResult[0].course.filter(item=> {
    if(item.name  == ctx.request.body.name && item.teacher == ctx.request.body.teacher && item.week == ctx.request.body.week) {
      return item
    }
  })
  
  if(classname.length > 0) {
    let stuResult = classname[0].students.filter(item => {
      if(item.stuName == ctx.request.body.stuName && item.stuId == ctx.request.body.stuId) {
        return item
      }
    })
    if(stuResult.length > 0) {
      const ontimeResult = stuResult[0].ontime
        const dateResult = ontimeResult.filter(item => {
          if(item.date == ctx.request.body.date) {
            return item
          }
        })
      if(dateResult.length > 0) {
        ctx.body = {
          status: 200,
          data: dateResult
        }
      } else {
        ctx.body = {
          status: 201,
          data: '未签到'
        }
      }
    } 
  } else {
    ctx.body = {
      status: 404,
      data: '加入课程错误，未找到课程'
    }
  }
})

/*
*@router GET  api/allcls/all
@desc 获取所有课程接口
@access  接口是公开的
*/

router.get('/all', async ctx => {
  const findResult = await AllCls.find()
  if(findResult.length == 0) {
    ctx.body = {
      status: 404,
      msg: '没有任何课程'
    }
  } else {
    ctx.body = {
      status: 200,
      data: findResult
    }
  }
})

/*
*@router POST  api/allcls/select/stu
@desc 查找是否签到接口
@access  接口是公开的
*/

router.post('/select/stu', async ctx => {
  const findResult = await AllCls.find()
  let newClsArray = []
  findResult.forEach(item => {
    if(item.course.length) {
      newClsArray.push(...item.course)
    }
  });;
  // console.log(newClsArray)
  let result = newClsArray.filter(item => {
    if(item.name == ctx.request.body.name && item.teacher == ctx.request.body.teacher && item.week == ctx.request.body.week) {
      return item
    }
  })
  
  if(result[0].students.length) {
    ctx.body = result[0].students
  } else {
    ctx.body = '暂无学生加入班级'
  }
})

module.exports = router.routes()
const Router = require('koa-router');
const router = new Router()
const student = require('../../models/Student')

/*
*@router GET  api/student/test
@desc 测试接口地址
@access  接口是公开的
*/

router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'user works..'
  }
})

router.post('/add', async ctx => {
  const newStudent = new student({
    teacher: ctx.request.body.teacher,
    name: ctx.request.body.name,
    classRoom: ctx.request.body.classRoom,
    week: ctx.request.body.week,
    quantum: ctx.request.body.quantum,
    begin: ctx.request.body.begin,
    end: ctx.request.body.end
  })
  await newStudent.save().then(res => {
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

module.exports = router.routes()
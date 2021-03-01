const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport')
const teaclass = require('../../models/TeaClass');
const teacher = require('./teacher');
const { setMaxListeners } = require('../../models/TeaClass');


/*
*@router GET  api/teaclass/test
@desc 测试接口地址
@access  接口是公开的
*/

// test
router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'test success'
  }
})

/*
*@router POST  api/teaclass/add/mclass
@desc 添加课程名接口
@access  接口是公开的
*/

router.post('/add/mclass',passport.authenticate('jwt', { session: false }), async ctx => {
  const profileFields = {}
  profileFields.mclass = []
  profileFields.user = ctx.state.user.id
  if(ctx.request.body.college) profileFields.college = ctx.request.body.college 
  const result = await teaclass.find({user: ctx.state.user.id})
  const newMsg = {
    classname: ctx.request.body.classname,
    place: ctx.request.body.place,
    week: ctx.request.body.week,
    quantum: ctx.request.body.quantum,
    beginTime: ctx.request.body.beginTime,
    endTime: ctx.request.body.endTime
  }
  if(result.length > 0) {
    const college = await teaclass.find({college: profileFields.college})
    // 学院存在
    if(college.length > 0) {
      const collegeResult = college[0].mclass
      // mclass存在
      if(collegeResult.length > 0) {
        let classname = collegeResult.filter(item=> {
          if(item.classname  == ctx.request.body.classname) {
            return item
          }
        })
        // 课程名存在
        if(classname.length > 0) {
          // 课程名相同，上课时间相同
          if(classname[0].week == ctx.request.body.week) {
            ctx.body = {
              status: 201,
              data: '此课程已添加'
            }
            // 课程名相同，上课时间不同
          } else {
            const mclassUpdate = await teaclass.updateOne(
              {user: ctx.state.user.id},
              {$push: {mclass: newMsg}},
              {$sort: 1}
            )
            if(mclassUpdate.ok == 1) {
              ctx.body = {
                status: 200,
                data: '课程添加成功'
              }
            } else {
              ctx.body = {
                status: 400,
                data: '课程添加失败'
              }
            }
          }
          // 课程名不存在
        } else {
          const mclassUpdate = await teaclass.updateOne(
            {user: ctx.state.user.id},
            {$push: {mclass: newMsg}},
            {$sort: 1}
          )
          if(mclassUpdate.ok == 1) {
            ctx.body = {
              status: 200,
              data: '课程添加成功'
            }
          } else {
            ctx.body = {
              status: 400,
              data: '课程添加失败'
            }
          }
        }
        // mclass不存在
      } else {
        profileFields.mclass = newMsg
        // 替换mclass
        const mcls = await teaclass.findOneAndUpdate(
          {user: ctx.state.user.id},
          {$set: profileFields},
          {new: true}
        )
        ctx.body = mcls
      }
      // 学院不存在
    } else {
      profileFields.mclass = newMsg
      await new teaclass(profileFields).save().then(res => {
        ctx.body = {
          status: 200,
          data: res
        }
      })
    }
  } else {
    profileFields.mclass = newMsg
    await new teaclass(profileFields).save().then(res => {
      ctx.body = {
        status: 200,
        data: res
      }
    })
  }
})


module.exports = router.routes()
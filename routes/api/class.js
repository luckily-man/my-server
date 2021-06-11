const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport')

// 引入模板实例
const mclass = require('../../models/Class')
const UserApp = require('../../models/UserApp');
const Class = require('../../models/Class');

/*
*@router GET  /api/class/test
@desc 测试接口地址
@access  接口是公开的
*/

// test
router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'profile works..'
  }
})

/*
*@router GET  /api/class
@desc 获取课程接口
@access  接口是私有的
*/

router.get('/', passport.authenticate('jwt', { session: false }),async ctx => {
  const result = await mclass.find()
  if(result.length > 0) {
    ctx.body = {
      status: 200,
      data: result
    } 
  } else {
    ctx.body = {status: 404, msg: '该用户没有任何相关的课程信息'}
    return;
  }
})

/*
*@router POST  /api/class/addclass
@desc 添加学院接口
@access  接口是私有的
*/

router.post('/addclass',passport.authenticate('jwt', { session: false }), async ctx => {
  const profileFields = {}
  profileFields.user = ctx.state.user.id
  if(ctx.request.body.college) profileFields.college = ctx.request.body.college
  const result = await mclass.find({user: ctx.state.user.id})
  // console.log(result);
  if(result.length > 0) {
    const mcls = await mclass.findOneAndUpdate(
      {user: ctx.state.user.id},
      {$set: profileFields},
      {new: true}
    )
    ctx.body = mcls
  } else {
    await new mclass(profileFields).save().then(res => {
      ctx.body = {
        status: 200,
        data: res
      }
    })
  }
})

/*
*@router POST  /api/class/week
@desc 添加课程接口
@access  接口是私有的
*/
router.post('/week', passport.authenticate('jwt', { session: false }), async ctx => {
  let week = ctx.request.body.week
  const profileFields = {}
  profileFields[week] = []
  const mcls = await Class.find({user: ctx.state.user.id})
  if(mcls.length > 0) {
    const newWeek = {
      name: ctx.request.body.name,
      teacher: ctx.request.body.teacher,
      classRoom: ctx.request.body.classRoom,
      quantum: ctx.request.body.quantum,
      begin: ctx.request.body.begin,
      end: ctx.request.body.end
    }
    profileFields[week].unshift(newWeek)
    const mclsUpdate = await Class.updateOne(
      {user: ctx.state.user.id},
      {$push: {[week]: profileFields[week]}},
      {$sort: 1}
    )
    if(mclsUpdate.ok == 1) {
      const mcls = await Class.find({user: ctx.state.user.id})
      if(mcls) {
        ctx.body = {
          status: 200,
          data: mcls
        }
      }
    } else {
      ctx.body = {
        status: 404,
        data: 'errors'
      }
    }
  }
})

/*
*@router GET  /api/class/selcls
@desc 查找某一天课程接口
@access  接口是私有的
*/

router.post('/selcls', passport.authenticate('jwt', { session: false }), async ctx => {
  const mcls = await Class.find({user: ctx.state.user.id})
  let weeks = ctx.request.body.weeks
  let profile = mcls[0][weeks]
  ctx.status = 200
  ctx.body = profile
})

/*
*@router GET  /api/class/selcls/one
@desc 查找某一天某一节课程接口
@access  接口是私有的
*/

router.post('/selcls/one', passport.authenticate('jwt', { session: false }), async ctx => {
  const mcls = await Class.find({user: ctx.state.user.id})
  let weeks = ctx.request.body.weeks
  let profile = mcls[0][weeks]
  const num = ctx.request.body.quantum -1
  const result = profile[num]
  if(result) {
    ctx.body = {
      status: 200,
      data: result,
      college: mcls[0].college
    }
  }else {
    ctx.body = {
      status: 404,
      error: '没有课程'
    }
  }
 
})

/*
*@router PUT  /api/class/mdify
@desc 编辑某一天谋一节课信息接口
@access  接口是私有的
*/

router.put('/mdify', passport.authenticate('jwt', { session: false }), async ctx => {
  const uuid = ctx.request.body.id - 1
  const week = ctx.request.body.weeks
  const profile = await Class.find({user: ctx.state.user.id})
  const newList = profile[0][week]
  if(newList.length > 0) {
    const removeIndex = newList[uuid]
    if(removeIndex.name == ctx.request.body.name) {
      ctx.body = {
        status: 403,
        dat: '课程已添加'
      }
    } else {
      const newMdi = {
        name:ctx.request.body.name,
        teacher: ctx.request.body.teacher,
        classRoom: ctx.request.body.classRoom,
        quantum: ctx.request.body.id,
        begin: ctx.request.body.begin,
        end: ctx.request.body.end,
      }
      newList[uuid] = newMdi
      profile[0][week] = newList
      const profileUpdate = await Class.findOneAndUpdate(
        {user: ctx.state.user.id},
        {$set: profile[0]},
        {new: true}
      )
      ctx.body = profileUpdate
    }
  } else {
    ctx.body = {
      msg: '没有任何数据',
      status: 404
    }
  }
})


/*
*@router DELETE  /api/class/del/one
@desc 删除某一天谋一节课信息接口
@access  接口是私有的
*/
router.delete('/del/one', passport.authenticate('jwt', { session: false }), async ctx => {
  const profile = await Class.find({user: ctx.state.user.id})
  const week = ctx.request.body.weeks
  const newList = profile[0][week]
  const uuid = ctx.request.body.uuid - 1
  const newMsg = newList[uuid]
  newMsg.name = '暂无课程'
  newMsg.teacher = ''
  newMsg. classRoom = ''
  newMsg.begin = '00:00'
  newMsg.end = '00:00'
  const profileUpdate = await Class.findOneAndUpdate(
    {user: ctx.state.user.id},
    {$set: profile[0]},
    {new: true}
  )
  ctx.body = {
    status: 200,
    data:profileUpdate
  }
  
})

module.exports = router.routes()
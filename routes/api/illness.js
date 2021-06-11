const Router = require('koa-router')
const router = new Router()


// 引入User
const Illness = require('../../models/Illness')

/*
*@router GET  api/illness/test
@desc 测试接口地址
@access  接口是公开的
*/

// test
router.get('/test', async ctx => {
  ctx.status = 200;
  ctx.body = {
    msg: 'user works..'
  }
})

/*
*@router POST  api/illness/add
@desc 请假接口
@access  接口是公开的
*/
router.post('/add', async ctx => {
  const newIllness = new Illness({
    name: ctx.request.body.name,
    stuId: ctx.request.body.stuId,
    type: ctx.request.body.type,
    beginDate: ctx.request.body.beginDate,
    endDate: ctx.request.body.endDate,
    reason: ctx.request.body.reason,
    boss: ctx.request.body.boss,
  })
  await newIllness.save().then(res => {
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
*@router GET  api/illness/all
@desc 查询所有请假信息
@access  接口是公开的
*/
router.get('/all', async ctx => {
  const findResult = await Illness.find()
  if(findResult.length == 0) {
    ctx.body = {
      status: 404,
      msg: '没有任何用户信息'
    }
  } else {
    ctx.body = {
      status: 200,
      msg: '查询成功',
      data: findResult
    }
  }
})

/*
*@router GET  api/illness/seleOne
@desc 查询某人请假信息 
@access  接口是公开的
*/

router.post('/seleOne', async ctx => {
  const findResult = await Illness.find()
  const stuId = ctx.request.body.stuId
  let result = findResult.filter(item=> {
    if(item.stuId == stuId) {
      return item
    }
  })
  if(result.length > 0) {
    ctx.status = 200
    ctx.body = result
  } else {
    ctx.body = { msg: '未找到记录!',status: 404,} 
  }
})

/*
*@router GET  api/illness/teacher
@desc 根据审批人获取请假信息 
@access  接口是公开的
*/

router.post('/teacher', async ctx => {
  const findResult = await Illness.find({boss: ctx.request.body.boss})
  if(findResult.length > 0) {
    const status = ctx.request.body.status
    if(status === 'true') {
      let trueResule = findResult.filter(item => {
        if(item.status == 'true') {
          return item
        }
      })
      ctx.body = {
        status: 200,
        data:trueResule
      }
    } else {
      let falseResule = findResult.filter(item => {
        if(item.status == 'false') {
          return item
        }
      })
      ctx.body = {
        status: 200,
        data: falseResule
      } 
    }
  } else {
    ctx.body = { msg: '未找到记录!',status: 404,} 
  }
})

/*
*@router GET  api/illness/approve
@desc 批准假期接口 
@access  接口是公开的
*/

router.put('/approve', async ctx => {
  const findResult = await Illness.find({_id: ctx.request.body._id})
  findResult[0].status = ctx.request.body.status
  const profileUpdate = await Illness.findOneAndUpdate(
    {_id: ctx.request.body._id},
    {$set: findResult[0]},
    {new: true}
  )
  ctx.body = profileUpdate
})

/*
*@router GET  api/illness/delete
@desc 删除请假接口 delete
@access  接口是公开的
*/

router.delete('/delete', async ctx => {
  const findResult = await Illness.find({_id: ctx.request.body._id})
  console.log(findResult);
  const profileUpdate = await Illness.deleteOne(
    {_id: ctx.request.body._id},
    // {$set: findResult},
    // {new: true}
  )
  if(profileUpdate.ok === 1) {
    ctx.body = {
      status: 200,
      data: '删除成功'
    }
  }
})

module.exports = router.routes()
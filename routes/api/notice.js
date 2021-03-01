const Router = require('koa-router')
const router = new Router()


// 引入User
const Notice = require('../../models/Notice')

/*
*@router GET  api/notice/test
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
*@router POST  api/notice/add
@desc 添加通知接口
@access  接口是公开的
*/
router.post('/add', async ctx => {
  const newNotice = new Notice({
    name: ctx.request.body.name,
    content: ctx.request.body.content
  })
  await newNotice.save().then(res => {
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
*@router GET  api/notice/all
@desc 获取所有通知接口
@access  接口是公开的
*/

router.get('/all', async ctx => {
  const findResult = await Notice.find()
  if(findResult.length == 0) {
    ctx.body = {
      status: 404,
      msg: '没有任何通知'
    }
  } else {
    ctx.body = {
      status: 200,
      data: findResult
    }
  }
})

/*
*@router POST  api/notice/selectOne
@desc 获取所有通知接口
@access  接口是公开的
*/

router.post('/selectOne', async ctx => {
  const findResult = await Notice.find({name: ctx.request.body.name})
  // console.log(findResult);
  ctx.body = {
    status: 200,
    data: findResult
  }
})

module.exports = router.routes()
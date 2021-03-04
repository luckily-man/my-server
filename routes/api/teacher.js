const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Teacher = require('../../models/Teacher')
const keys = require('../../config/key')

const passport = require('koa-passport')
// 引入Userapp
/*
*@router POST  api/teacher/register
@desc 注册接口地址
@access  接口是公开的
*/

router.post('/register', async ctx => {
  // 存储到数据库
  const findResult = await Teacher.find({stuId: ctx.request.body.stuId})
  if(findResult.length > 0) {
    ctx.body = {
      msg: '教职工号已注册',
      status: 500
    }
  } else {
    const newTeacher = new Teacher({
      name: ctx.request.body.name,
      stuId: ctx.request.body.stuId,
      password: ctx.request.body.password
    });
    // 加密
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newTeacher.password, salt);
    // console.log(hash);
    newTeacher.password = hash

    // 存储到数据库
    await newTeacher.save()
    .then(res => {
      ctx.body = {
        status: 200,
        res
      }
    }).catch(err => {
      console.log(err);
    })
  }
})

/*
*@router POST  api/teacher/login
@desc 注册接口地址
@access  接口是公开的
*/

router.post('/login', async ctx => {
  // 查询
  const findResult =  await Teacher.find({stuId: ctx.request.body.stuId});
  const user = findResult[0]
  const password = ctx.request.body.password
  // 判断查没查到
  if(findResult.length == 0) {
    ctx.body = { msg: '用户不存在!',status: 404,} 
  } else {
    // 查到后验证密码
    const result = bcrypt.compareSync(password, user.password); // true
    // 验证通过
    if(result) {
      // 返回token
      const payload = {
        id: user.id,
        name: user.name,
      }
      const token = jwt.sign(payload, keys.secretOrKey, {expiresIn: 86400})
      ctx.body = {status: 200, permission: user.permission, success: true, token: "Bearer " + token}
    }else{
      ctx.body = {msg: '密码错误!', status: 400,}
    }
  }
})


/*
*@router GET  api/teacher/all
@desc 教师接口
@access  接口是公开的
*/
router.get('/all', async ctx => {
  const findResult =  await Teacher.find();
  if(findResult.length > 0) {
    ctx.body = {
      status:200,
      data: findResult
    }
  }else {
    ctx.body = {
      status: 404,
      data: '没有任何数据'
    }
  }
})


/*
*@router GET  api/teacher/current
@desc 用户信息接口地址 返回用户信息
@access  接口是私密的
*/

router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
  ctx.body = {
    id: ctx.state.user.id,
    name: ctx.state.user.name,
  }
})
module.exports = router.routes()
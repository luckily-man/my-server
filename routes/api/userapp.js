const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require('../../config/key')
const passport = require('koa-passport')
// 引入Userapp
const UserApp = require('../../models/UserApp')
// 引入验证
const validatorRegisterInput = require('../../validation/registerApp')
const validatorLoginInput = require('../../validation/loginapp')
const validatorEditPwdInput = require('../../validation/editpwd')

/*
*@router POST  api/userapp/register
@desc 注册接口地址
@access  接口是公开的
*/

router.post('/register', async ctx => {
  // console.log(ctx.request.body);
  const { errors, isValid } = validatorRegisterInput(ctx.request.body)
  // 判断是否验证通过
  if(!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  // 存储到数据库
  const findResult = await UserApp.find({stuId: ctx.request.body.stuId})
  if(findResult.length > 0) {
    ctx.body = {
      msg: '学号已注册',
      status: 500
    }
  } else {
    const avatar = gravatar.url(ctx.request.body.email, {s: '200', r: 'pg', d: 'mm'})
    const newUser = new UserApp({
      name: ctx.request.body.name,
      stuId: ctx.request.body.stuId,
      phone: ctx.request.body.phone,
      email: ctx.request.body.email,
      avatar,
      password: ctx.request.body.password
    });
    // 加密
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newUser.password, salt);
    // console.log(hash);
    newUser.password = hash

    // 存储到数据库
    await newUser.save()
    .then(user => {
      // console.log(user);
      ctx.body = {
        status: 200,
        user
      }
    }).catch(err => {
      console.log(err);
    })
  }
})

/*
*@router POST  api/userapp/login
@desc 登录接口地址 返回token
@access  接口是公开的
*/

router.post('/login', async ctx => {
  const { errors, isValid } = validatorLoginInput(ctx.request.body)
  // 判断是否验证通过
  if(!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  // 查询
  const findResult =  await UserApp.find({stuId: ctx.request.body.stuId});
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
        avatar: user.avatar
      }
      const token = jwt.sign(payload, keys.secretOrKey, {expiresIn: 86400})
      ctx.body = {status: 200, permission: user.permission, success: true, token: "Bearer " + token}
    }else{
      ctx.body = {msg: '密码错误!', status: 400,}
    }
  }
})

/*
*@router POST  api/userapp/edit
@desc 修改密码 返回用户信息
@access  接口是私密的
*/
router.post('/edit', async ctx => {
  const { errors, isValid } = validatorEditPwdInput(ctx.request.body)
  // 判断是否验证通过
  if(!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  const profile = await UserApp.find({stuId: ctx.request.body.stuId})
  console.log(profile[0]);
  if(profile.length == 0) {
    ctx.body = {
      status: 500,
      msg: '未找到用户'
    }
  }else {
    if(profile[0].stuId === ctx.request.body.stuId && profile[0].phone === ctx.request.body.phone) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(ctx.request.body.password, salt);
    // console.log(hash);
      profile[0].password = hash
      const userUpdate = await UserApp.findOneAndUpdate(
        {stuId: ctx.request.body.stuId},
        {$set: profile[0]},
        {new: true}
      )
      ctx.body = {
        status: 200,
        msg: '修改成功',
        data: userUpdate
      }
    } else {
      ctx.body = {
        status: 404,
        msg: '手机号输入错误'
      }
    } 
  }
})

/*
*@router GET  api/userapp/current
@desc 用户信息接口地址 返回用户信息
@access  接口是私密的
*/

router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
  console.log('111');
  ctx.body = {
    stuId: ctx.state.user.stuId,
    name: ctx.state.user.name,
    email: ctx.state.user.email,
    avatar: ctx.state.user.avatar
  }
})

router.get('/all', async ctx => {
  console.log('111');
  const findResult = await UserApp.find()
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
module.exports = router.routes()
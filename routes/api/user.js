const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require('../../config/key')
const passport = require('koa-passport')

// 引入User
const User = require('../../models/User')

// 引入验证
const validatorRegisterInput = require('../../validation/register')
const validatorLoginInput = require('../../validation/login')

/*
*@router GET  api/users/test
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
*@router POST  api/users/register
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
  const findResult = await User.find({email: ctx.request.body.email})
  if(findResult.length > 0) {
    
    ctx.body = {
      msg: '邮箱已被占用',
      status: 500
    }
  } else {
    const avatar = gravatar.url(ctx.request.body.email, {s: '200', r: 'pg', d: 'mm'})
    const newUser = new User({
      name: ctx.request.body.name,
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
    // console.log(sss);

  }
})

/*
*@router POST  api/users/login
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
  const findResult =  await User.find({email: ctx.request.body.email});
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
      
      ctx.body = {status: 200, success: true, token: "Bearer " + token}
    }else{
      ctx.body = {msg: '密码错误', status: 400,}
    }
  }
})

/*
*@router GET  api/users/current
@desc 用户信息接口地址 返回用户信息
@access  接口是私密的
*/

router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
  ctx.body = {
    id: ctx.state.user.id,
    name: ctx.state.user.name,
    email: ctx.state.user.email,
    avatar: ctx.state.user.avatar
  }
})

module.exports = router.routes()
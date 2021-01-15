const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require('../../config/key')

// 引入User
const User = require('../../models/User')

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

  // 存储到数据库
  const findResult = await User.find({email: ctx.request.body.email})
  if(findResult.length > 0) {
    ctx.status = 500;
    ctx.body = {
      email: '邮箱已被占用'
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
    await newUser.save().then(user => {
      // console.log('111');
      ctx.body = user
    }).catch(err => {
      console.log(err);
    })

    // 返回json数据
    ctx.body = newUser
  }
})

/*
*@router POST  api/users/login
@desc 登录接口地址 返回token
@access  接口是公开的
*/

router.post('/login', async ctx => {
  // 查询
  const findResult =  await User.find({email: ctx.request.body.email});
  const user = findResult[0]
  const password = ctx.request.body.password
  // 判断查没查到
  if(findResult.length == 0) {
    ctx.status = 404,
    ctx.body = { email: '用户不存在!'} 
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
      const token = jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600})

      ctx.status = 200,
      ctx.body = {success: true, token: "Bearer " + token}
    }else{
      ctx.status = 400,
      ctx.body = {password: '密码错误'}
    }
  }
})

/*
*@router GET  api/users/current
@desc 用户信息接口地址 返回用户信息
@access  接口是私密的
*/

router.get('/current', 'token验证', async ctx => {
  ctx.body = {success: true}
})

module.exports = router.routes()
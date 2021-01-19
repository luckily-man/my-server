const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')

// 实例化koa
const app = new Koa()
const router = new Router()

app.use(bodyParser())

// 引入user.js
const users = require('./routes/api/user')
const profile = require('./routes/api/profile')

// 路由
router.get('/', async ctx => {
  ctx.body = {
    msg: 'hello owrld interfaces'
  }
})

// config
const db = require('./config/key').mongoURL

// 连接数据库
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('mongoosedb connect');
  })
  .catch(()=> {
    console.log(err);
  })

app.use(passport.initialize())
app.use(passport.session())

// 回调到config文件中
require('./config/passport')(passport)

// 配置路由地址localhost:3000/api/users
router.use('/api/users', users)
router.use('/api/profile', profile)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`server started on ${port}`);
})

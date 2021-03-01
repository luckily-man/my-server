const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const cors = require('koa-cors')
const axios = require('axios')

// 实例化koa
const app = new Koa()

// 处理跨域
app.use(cors())

const router = new Router()

app.use(bodyParser())


// 引入user.js
const users = require('./routes/api/user')
const profile = require('./routes/api/profile')
const userapp = require('./routes/api/userapp')
const notice = require('./routes/api/notice')
const mclass = require('./routes/api/class')
const illness = require('./routes/api/illness')
const allcls = require('./routes/api/allcls')
const teacher = require('./routes/api/teacher')
const teaclass = require('./routes/api/teaclass')
const student = require('./routes/api/student')

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

// 配置路由地址localhost:3000/api/***
router.use('/api/users', users)
router.use('/api/profile', profile)
router.use('/api/userapp', userapp)
router.use('/api/notice', notice)
router.use('/api/class', mclass)
router.use('/api/illness', illness)
router.use('/api/allcls', allcls)
router.use('/api/teacher', teacher)
router.use('/api/teaclass', teaclass)
router.use('/api/student', student)


// 配置路由
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`server started on ${port}`);
})


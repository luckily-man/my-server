const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/key')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const mongoose = require('mongoose')
const User = mongoose.model('users')
const UserApp = mongoose.model('userapp')
const Teacher = mongoose.model('teacher')
module.exports = passport => {
  // console.log(passport);
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    const users = await User.findById(jwt_payload.id)
    const teacher = await Teacher.findById(jwt_payload.id)
    const user = await UserApp.findById(jwt_payload.id)
    // console.log(teaclass);
    
    if(users){
      return done(null, users)
    }else if(teacher) {
      return done(null, teacher)
    } else if(user){
      return done(null, user)
    } else {
      return done(null, false)
    }
}));
}



const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/key')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const mongoose = require('mongoose')
const User = mongoose.model('users')
const UserApp = mongoose.model('userapp')
module.exports = passport => {
  // console.log(passport);
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    // console.log(jwt_payload);
    // const user = await User.findById(jwt_payload.id)
    // if(user) {
    //   return done(null, user)
    // } else {
    //   return done(null, false)
    // }
    const user = await UserApp.findById(jwt_payload.id)
    if(user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
    // User.findOne({id: jwt_payload.sub}, function(err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });
}));
}
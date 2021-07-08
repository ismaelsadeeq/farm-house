const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config()


const models = require('../models');

const jwtOption = {}
jwtOption.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

jwtOption.secretOrKey = process.env.SECRET;

module.exports = passport =>{
  passport.use(new JwtStrategy(
    jwtOption, async (jwt_payload, done)=>{
       const out =  await models.isLoggedOut.findOne(
         {
          where:{adminId:jwt_payload.id,status:true}
         }
      )
    //   const out2 =  await models.isLoggedOut.findOne(
    //     {
    //      where:{userId:jwt_payload.id,status:true}
    //     }
    //  )
      if(out){
        return done(null, false)
      } 
      const user = await models.admin.findOne(
        {
          where:{id:jwt_payload.id}
        }
      )
      if(user){
        return done(null,user);
      }
      return done(null,false);
    }
  ));
}
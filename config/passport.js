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
      const out2 =  await models.isLoggedOut.findOne(
        {
         where:{farmerId:jwt_payload.id,status:true}
        }
     )
      if(out){
        return done(null, false)
      }
      if(out2){
        return done(null, false)
      }  
      const admin = await models.admin.findOne(
        {
          where:{id:jwt_payload.id}
        }
      );
      const farmer = await models.farmer.findOne(
        {
          where:{id:jwt_payload.id}
        }
      )
      if(admin){
        const user = admin
        return done(null,user);
      }else if(farmer){
        const user = farmer
        return done(null,user);
      }
      return done(null,false);
    }
  ));
}
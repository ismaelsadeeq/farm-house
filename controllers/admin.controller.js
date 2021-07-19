//imports
const models = require('../models');
const bcrypt = require('bcrypt');
const JwtStartegy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const mailer = require('../utilities/mailjet');
const helpers = require('../utilities/helpers')
require('dotenv').config();

//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}

//controller handlers

const createAdmin = async (req,res) =>{
  const data = req.body;
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  if(isEmpty(data)) {
    responseData.status = false;
    responseData.message = "empty post"
    return res.json(responseData)
  }
  const checkAdmin = await models.admin.findOne({where:{email:data.email}});
  var admin = undefined;

  if (checkAdmin){
    responseData.message = 'you have an account sign in';
    responseData.status=false
    return res.json(responseData);
  } 
  else
  {
    admin = await models.admin.create(
      {
        id:uuid.v4(),
        firstname:data.firstname,
        lastname:data.lastname,
        email:data.email,
        phoneNumber:data.phoneNumber,
      }
    );
  }
  if(!admin){
    responseData.status = false;
    responseData.message = "Could not create account";
    responseData.data=admin;
    return res.json(responseData);
  }
  //generate otp and send email
  let val = helpers.generateOTP();
  let names = data.firstname;
  const msg = "Welcome "+names+", use the code "+ val+" to verify your email and create your FarmHouse HQ Password";
  const htmlPart = `<div>
  <h3> Hello ${names}</h3
  <p>${msg}</p>

  <footer></footer>
  <p>This is a noreply email from FarmHouseHQ.com</p>
</div>`
  data.variables = {
    "names":names,
    "code": val,
    "summary": msg,
    "html":htmlPart,
    "body":msg
  }
  data.val = val
  await models.otpCode.create({id:uuid.v4(),code:val,adminId:admin.id});
  // sendEmail(data)
  responseData.status = true
  responseData.message = "Account created use the code sent the email provided to verify and set ppassword";
  return res.json(responseData);

}
const adminLogin = async (req,res)=>{
    const data = req.body;
    const email = data.email;
    const password = data.password;
    const admin = await models.admin.findOne(
      {
        where:{email:email},
        attributes:['id','firstname','lastname','phoneNumber','email','password']
      }
      );
    if (admin){
      const checkPassword = bcrypt.compareSync(password, admin.password);
      if (!checkPassword) {
        responseData.message = 'Incorrect passsword';
        responseData.status = false;
        return res.json(responseData)
      } else {
        const jwt_payload ={
          id:admin.id,
        }
        await models.isLoggedOut.destroy({where:{adminId:admin.id}}) 
        const token = jwt.sign(jwt_payload,process.env.SECRET);
        admin.password = null;
        return res.json(
          { "token":token,
            "data":admin,
            "statusCode":200,
            "status": 'success'
          }
        )
      }
  } else {
    return res.json('No account found')
  }
};

const logout = async(req,res)=>{
  await models.isLoggedOut.create({id:uuid.v4(),adminId:req.user.id,status:true});
  res.json("logged out");
};
const getAdmin = async  (req,res)=>{
  const user = req.user;
  const admin = await models.admin.findOne(
    {
      where:{
        id:user.id
      },
      attributes:['id','firstname','lastname','phoneNumber','email']
    }
  );
  if(admin){
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = admin
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "something went wrong";
  responseData.data = admin
  return res.json(responseData);
}

const editAdmin = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const updateAdmin = await models.admin.update(
    {
      firstname:data.firstname,
      lastname:data.lastname,
      email:data.email,
      phoneNumber:data.phoneNumber,
    },
    {
      where:{
        id:user.id
      }
    }
  );
  responseData.status = true;
  responseData.message = "admin is updated";
  return res.json(responseData);
}

const deleteAdmin = async (req,res)=>{
  const user = req.user;
  const deleteAdmin = await models.admin.destroy(
    {
      where:{
        id:user.id
      }
    }
  );
  responseData.status = true;
  responseData.message = "deleted";
  return res.json(responseData);
}

const verifyEmail = async (req,res)=>{
  const data = req.body;
  const code = await models.otpCode.findOne(
    {
      where:{code:data.code}
    }
  );
  if(code){
    const user = await models.admin.findByPk(code.id);
    if(user){
      responseData.message = 'Account is already verified';
      return res.json(responseData);
    } 
    if(data.password !== data.confirmPassword){
      responseData.status = true;
      responseData.message = "Password does not match";
      return res.json(responseData);
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(data.password,salt)
    const userr = await models.admin.findOne(
      {
        where:{id:code.adminId}
      }
    );
    await models.admin.update(
      {
        isVerified:true,
        password:hash
      },
      {
        where:{id:code.adminId}
      }
    );
    await models.otpCode.destroy(
      {
        where:{code:data.code}
      }
    );
    let names = userr.firstname
    const msg = "Hello "+names+", your FarmHouseHQ Account is successfully Verified";
    const htmlPart = `<div>
        <h3> Hello ${names}</h3
        <p>${msg}</p>
			
        <footer>
          <p>This is a noreply email from FarmHouseHQ.com</p>
        </footer>
			</div>`
    data.email = userr.email
    data.variables = {
      "names":names,
      "htmlPart":htmlPart,
      "code":"",
      "summary": msg,
      "body":msg
    }
    // sendEmail(data)
    responseData.message = 'Account Verified';
    responseData.status = true;
    return res.json(responseData);
  }else{
    responseData.status = false,
    responseData.message = 'Invalid Code entered';
    return res.json(responseData)
  }
}
const sendCode = async (req,res)=>{
  const data = req.body;
  const email = data.email;
  const admin = await models.admin.findOne(
    {
      where:{email:email}
    }
  )
  if (admin){
    let val = helpers.generateOTP();
    const summary = "Hello "+admin.firstname+", use the code "+ val+" to reset your password to FarmHQ Account";
    const msg = "Hello "+admin.firstname+", we heard you could not login to your  Account. This things happen to even the most careful of us, you should not feel so bad.  In the meantime, use the code "+ val+" to reset your password for your FarmHouseHQ Account. You should be back into your account in no time. <br/> <br /> <br /> <br /> <small>If you did not request this, you do not have to do anything  </small>";
    let names = admin.firstname +" "+ admin.lastname
    const htmlPart = `<div>
    <h3> Hello ${names}</h3
    <p>${summary}</p>
  
    <footer></footer>
    <p>This is a noreply email from FarmHouseHQ.com</p>
  </div>`
    data.variables = {
       "code": val,
       "summary": summary,
       "htmlPart":htmlPart,
       "names": names,
       "body":msg
    }

    data.val = val
    const sendMail = sendEmail(data)
    if(sendMail){
    await models.otpCode.create(
      {
        id:uuid.v4(), 
        code:val,
        adminId:admin.id
      }
    );
    responseData.message = "Code Sent"
    return res.json(responseData);
    } else{
      responseData.message = "An error occurred";
      responseData.status = false
      return res.json(responseData)
    }
    
  }else{
    res.json({
      "status":false,
      "message":"No account with this email"
    })
  }

}
const resetPassword = async  (req,res)=>{
  data = req.body;
  const code = await models.otpCode.findOne(
    {
      where:{code:data.code}
    }
  );
  if(code){
      if(data.password === data.confirmPassword){
        const saltRounds = 10 
        const salt = bcrypt.genSaltSync(saltRounds);

        const hash = bcrypt.hashSync(data.password, salt);
      
        data.password = hash
        await models.admin.update(
          {
            password:data.password
          },
          {
            where:{id:code.adminId}
          }
        );
        await models.otpCode.destroy(
          {
            where:{code:data.code}
          }
        )
        responseData.status = true;
        responseData.message = 'password changed'
        return res.json(responseData)
      }
      else{
        responseData.status = false;
        responseData.message = 'password do not match'
        return res.json(responseData)
      }
  }else{
    responseData.status = true;
    responseData.message = 'Code is Incorrect'
    return res.json(responseData)
  }
}

async function changePassword(req,res){
  data = req.body;
  const admin = await models.admin.findOne(
    {
      where:{id:req.user.id}
    }
  );
  const checkPassword =  bcrypt.compareSync(data.password, admin.password);
  if(checkPassword){
    if(data.newPassword === data.confirmPassword){
      const saltRounds = 10 
      const salt = bcrypt.genSaltSync(saltRounds);

      const hash = bcrypt.hashSync(data.newPassword, salt);
      
      data.newPassword = hash
      await models.admin.update(
        {
          password:data.newPassword
        },
        {
          where:{
            id:req.user.id
          }
        }
      );
      responseData.status = true;
      responseData.message = "password changed";
      return res.json(responseData)
    } else {
      responseData.status = true;
      responseData.message = "password did not match"
      return res.json(responseData)
    }
  } else{
    responseData.status = true;
    responseData.message = "incorrect password"
    res.json(responseData);
  }
  
} 

const sendEmail= (data)=>{
  const sendMail = mailer.sendMail(data.email, data.variables,data.msg)
 if(sendMail){
 return true
 } else{
   return false
 }
}

module.exports = {
  getAdmin,
  logout,
  adminLogin,
  createAdmin,
  deleteAdmin,
  editAdmin,
  verifyEmail,
  sendCode,
  resetPassword,
  changePassword
}
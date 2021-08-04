const uuid = require("uuid");
const models = require("../models"); 
const bcrypt = require("bcrypt");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const mailer = require("../utilities/mailjet");
const helpers = require("../utilities/helpers");
const paystackApi = require('../utilities/paystack.api');
require("dotenv").config();
const mailjet = require ("node-mailjet").connect(process.env.MAILJET_PUBLIC,process.env.MAILJET_PRIVATE);

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const register = async (req,res) =>{
  const data = req.body;
  if(data.password === data.confirmPassword){
      const id = uuid.v4();
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(data.password,salt)

      data.password = hash;
      let msg;
      const checkUser = await models.user.findOne({where:{email:data.email}});
      var user = undefined;

      if (checkUser){
        responseData.message = "you have an account sign in";
        responseData.status=false
        return res.json(responseData);
      } 
      else
      {
         user = await models.user.create(
          {
           id:id,
           firstName:data.firstname,
           lastName:data.lastname,
           email:data.email,
           phoneNumber:data.phoneNumber,
           password:data.password,
           bvnNumber:data.bvnNumber
          }
        );
        //generate otp and send email
        let val = helpers.generateOTP();
        let names = data.firstname +' '+ data.lastname
        const msg = "Welcome "+user.firstName+", use the code "+ val+" to verify your email and activate your FarmHouse Open API Account";
        const htmlPart = `<div>
				<h3> Hello ${names}</h3
				<p>${msg}</p>
			
				<footer></footer>
				<p>This is a noreply email from FarmHouse.com</p>
			</div>`
        data.variables = {
          "names":names,
          "code": val,
          "summary": msg,
          "html":htmlPart,
          "body":msg
        }
        data.val = val
        await models.otpCode.create({id:uuid.v4(),code:val,userId:user.id});
        sendEmail(data)
      }
      if(!user){
        responseData.status = false;
        responseData.message = "Could not create account";
        responseData.data=user;
        return res.json(responseData);
      }
      const payload = {
        "email":data.email,
        "id":id
      }
      const createCustomer =  await paystackApi.createCustomer(payload);
      responseData.status = true
      responseData.message = "Account created succesfully";
      return res.json(responseData);

  } else {
    responseData.status = false
    responseData.message = "password didnt match";
      return res.json(responseData)
  }
}

const login = async (req,res)=>{
  const data = req.body;
    const email = data.email;

    const password = data.password;
    const user = await models.user.findOne(
      {
        where:{email:email},
        attributes:["id","firstName","lastName","email","password","phoneNumber","bvnNumber"]  
      }
      );
    if (user){
      const checkPassword = bcrypt.compareSync(password,user.password);
      if (!checkPassword) {
        responseData.message = "Incorrect passsword";
        responseData.status = false;
        return res.json(responseData)
      } else {
        const jwt_payload ={
          id:user.id,
        }
        await models.isLoggedOut.destroy({where:{userId:user.id}}) 
        const token = jwt.sign(jwt_payload,process.env.SECRET);
        user.password = undefined;
        return res.json(
          { "token":token,
            "data":user,
            "statusCode":200,
            "status": "success"
          }
        )
      }
  } else {
    responseData.status = false;
    responseData.message = "No account found"
    return res.json(responseData)
  }
}
const sendCode = async (req,res)=>{
  const data = req.body;
  const email = data.email;
  const user = await models.user.findOne(
    {
      where:{email:email}
    }
  )
  if (user){
    let val = helpers.generateOTP();
    const summary = "Hello "+user.firstName+", use the code "+ val+" to reset your password to Open API Account";
    const msg = "Hello "+user.firstName+", we heard you could not login to your  Account. This things happen to even the most careful of us, you should not feel so bad.  In the meantime, use the code "+ val+" to reset your password for your Open API Account. You should be back into your account in no time. <br/> <br /> <br /> <br /> <small>If you did not request this, you do not have to do anything  </small>";
    let names = user.firstName +" "+ user.lastName
    const htmlPart = `<div>
    <h3> Hello ${names}</h3
    <p>${summary}</p>
  
    <footer></footer>
    <p>This is a noreply email from FarmHouse.com</p>
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
        userId:user.id
      }
    );
    responseData.message = "code Sent"
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
const editUser = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const updateUser = await models.user.update(
    {
      firstName:data.firstname,
      lastName:data.lastname,
      email:data.email,
      phoneNumber:data.phoneNumber
    },
    {
      where:{
        id:user.id
      }
    }
  );
  const wallet = await models.wallet.findOne({where:{userId:user.id}})
  await paystackApi.updateCustomer(wallet.customerCode,user);
  responseData.status = true;
  responseData.message = "user is updated";
  return res.json(responseData);
}
const addBvn = async (req,res) =>{
  const user = req.user;
  const data = req.body;
  const isBvnVerified = await models.user.findOne(
    {
      where:{
        id:user.id,
        isBvnVerified:false || null
      }
    }
  );
  if(!isBvnVerified){
    responseData.status = true;
    responseData.message = "Customer already identified";
    responseData.data = null
    return res.json(responseData);
  }
  const updateBvn = await models.user.update(
    {
      bvnNumber:data.bvnNumber
    },
    {
      where:{
        id:user.id
      }
    }
  );
  if(!updateBvn){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  const userr = await models.user.findOne(
    {
      where:{
        id:user.id
      }
    }
  )
  const validate = await paystackApi.validateCustomer(
    wallet.customerCode,
    userr
  );
  responseData.status = true;
  responseData.message = "Bvn updated awaiting validation";
  responseData.data = null
  return res.json(responseData);
}
const verifyEmail = async (req,res)=>{
  const data = req.body;
  const code = await models.otpCode.findOne({where:{code:data.code}});
  if(code){
    const user = await models.user.findByPk(code.id);
    if(user){
      responseData.message = 'Account is already verified';
      return res.json(responseData);
    } 
      const userr = await models.user.findOne(
        {
          where:{id:code.userId}
        }
      );
      const wallet = await models.wallet.findOne(
        {
          where:{userId:code.userId}
        }
      )
      const createAccount = await paystackApi.createNobaDedicatedAccount(
        wallet.customerCode,
        code.userId
      )
      const publicKey = uuid.v4();
      const privateKey = uuid.v4();

      const updateUser = await models.user.update(
        {
          isAccountVerified:true,
          privateKey:privateKey,
          publicKey:publicKey
        },
        {
          where:{
            id:code.userId
          }
        }
      )
      await models.otpCode.destroy(
        {
          where:{code:data.code}
        }
      )
      let names = userr.firstName +' '+ userr.lastName;
      const msg = "Hello "+userr.firstName+", your NobaAfrica Account is successfully Verified";
      const htmlPart = `<div>
				<h3> Hello ${names}</h3
				<p>${msg}</p>
			
				<footer></footer>
				<p>This is a noreply email from NobaAfrica.com</p>
			</div>`
      data.email = userr.email
      data.variables = {
        "names":names,
        "htmlPart":htmlPart,
        "code":"",
        "summary": msg,
        "body":msg
      }
      sendEmail(data)
      responseData.message = 'Account Verified';
      responseData.status = true;
      return res.json(responseData);
  } else {
    responseData.status = false,
    responseData.message = 'Invalid Code entered';
    return res.json(responseData)
  }
}
const getKeys = async (req,res)=>{
  const user = req.user;
  const keys = await models.user.findOne(
    {
      where:{
        id:user.id
      },
      attributes:['privateKey','publicKey']
    }
  );
  if(!keys){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = keys
  return res.json(responseData);
}
const generateNewKeys = async (req,res)=>{
  const user = req.user;
  const publicKey = uuid.v4();
  const privateKey = uuid.v4();
  const updateUser = await models.user.update(
    {
      privateKey:privateKey,
      publicKey:publicKey
    },
    {
      where:{
        id:user.id
      }
    }
  );
  if(!updateUser){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "keys Generated";
  const keys = {
    publicKey:publicKey,
    privateKey:privateKey
  }
  responseData.data = keys
  return res.json(responseData);
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
        await models.user.update(
          {
            password:data.password
          },
          {
            where:{id:code.userId}
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
const logout = async (req,res)=>{
  await models.isLoggedOut.create({id:uuid.v4(),userId:req.user.id,status:true});
  responseData.status = true;
  responseData.message = "logged out"
  return res.json(responseData);
}
async function changePassword(req,res){
  data = req.body;
  const user = await models.user.findOne(
    {
      where:{id:req.user.id}
    }
  );
  const checkPassword =  bcrypt.compareSync(data.password, user.password);
  if(checkPassword){
    if(data.newPassword === data.confirmPassword){
      const saltRounds = 10 
      const salt = bcrypt.genSaltSync(saltRounds);

      const hash = bcrypt.hashSync(data.newPassword, salt);
      
      data.newPassword = hash
      await models.user.update(
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
    return res.json(responseData);
  }
  
} 
const getUser = async  (req,res)=>{
  const user = req.user;
  const userDetails = await models.user.findOne(
    {
      where:{
        id:user.id
      },
      attributes:['id','firstName','lastName','phoneNumber','email','bvnNumber','privateKey','publicKey']
    }
  );
  if(user){
    responseData.status = true;
    responseData.message = "completed";
    responseData.data = userDetails
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "something went wrong";
  responseData.data = null
  return res.json(responseData);
}
const deleteUser = async (req,res)=>{
  const user = req.user;
  const deleteUser = await models.user.destroy(
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

const createDeliveryAddress = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const createAddress = await models.deliveryAddress.create(
    {
      id:uuid.v4(),
      userId:user.id,
      state:data.state,
      lga:data.lga,
      postalCode:data.postalCode,
      address:data.address
    }
  );
  if(!createAddress){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = createAddress
  return res.json(responseData);
}
const editDeliveryAddress = async (req,res)=>{
  const user = req.user;
  const data = req.body;
  const id = req.params.id;
  const updateAddress = await models.deliveryAddress.update(
    {
      userId:user.id,
      state:data.state,
      lga:data.lga,
      postalCode:data.postalCode,
      address:data.address
    },
    {
      where:{
        id:id
      }
    }
  );
  if(!updateAddress){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "updated";
  responseData.data = null
  return res.json(responseData);
}
const deleteDeliveryAddress = async (req,res)=>{
  const id = req.params.id;
  const deleteAddress = await models.deliveryAddress.destroy(
    {
      where:{
        id:id
      }
    }
  );
  if(!deleteAddress){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "deleted";
  responseData.data = null
  return res.json(responseData);
}
const getDeliveryAddresses = async (req,res)=>{
  const user = req.user;
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit
  const adresses = await models.deliveryAddress.findAll(
    {
      order:[['createdAt','DESC']],
			offset:skip,
			limit:pageLimit,
      where:{
        userId:user.id
      }
    }
  );
  if(!adresses){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "updated";
  responseData.data = adresses
  return res.json(responseData);
}
const getDeliveryAddress = async (req,res)=>{
  const id = req.params.id;
  const address = await models.deliveryAddress.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!address){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = address
  return res.json(responseData)
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
  register,
  login,
  sendCode,
  verifyEmail,
  resetPassword,
  logout,
  getUser,
  editUser,
  changePassword,
  deleteUser,
  getKeys,
  generateNewKeys,
  addBvn,
  createDeliveryAddress,
  editDeliveryAddress,
  deleteDeliveryAddress,
  getDeliveryAddresses,
  getDeliveryAddress
}
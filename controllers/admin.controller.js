//imports
const models = require('../models');
const bcrypt = require('bcrypt');
const JwtStartegy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const uuid = require('uuid');


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
  if(data.password === data.confirmPassword){
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(data.password,salt)

    data.password = hash;
    let msg;
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
          password:data.password
        }
      );
    }
    if(!admin){
      responseData.status = false;
      responseData.message = "Could not create account";
      responseData.data=admin;
      return res.json(responseData);
    }
    responseData.status = true
    responseData.message = "Account created succesfully";
    return res.json(responseData);


  } else {
    return res.json('password didnt match')
  }
}
const adminLogin = async (req,res)=>{
    const data = req.body;
    const email = data.email;
    const password = data.password;
    const admin = await models.admin.findOne(
      {where:{email:email}}
      );
    if (admin){
      const checkPassword = bcrypt.compareSync(password, admin.password);
      if (!checkPassword) {
        responseData.message = 'Incorrect passsword';
        responseData.status = false;
        return res.json(responseData)
      } else {
        const jwt_payload ={
          id:user.id,
        }
        await models.isLoggedOut.destroy({where:{adminId:user.id}}) 
        const token = jwt.sign(jwt_payload,process.env.SECRET);
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
  await models.isLoggedOut.create({id:uuid.v4(),userId:req.user.id,status:true});
  res.json("logged out");
};
const getAdmin = async  (req,res)=>{
  const user = req.user;
  const admin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
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

module.exports = {
  getAdmin,
  logout,
  adminLogin,
  createAdmin,
  deleteAdmin,
  editAdmin
}
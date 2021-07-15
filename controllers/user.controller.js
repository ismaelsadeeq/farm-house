const uuid = require('uuid');
const bcrypt = require('bcrypt')
const helpers = require('../utilities/helpers');
const models = require('../models')
const multer = require('multer');
const jwt = require('jsonwebtoken');
const multerConfig = require('../config/multer');
const smsGlobal = require('../utilities/sms.api');
require('dotenv').config();
const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const createSHFAccount = async (req,res) =>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    multerConfig.singleUpload(req, res, async function(err) {
			if (err instanceof multer.MulterError) {
        responseData.status = false,
        res.statusCode = 200;
        responseData.message = err.message  + "something went wrong"
				return res.json(responseData);
			} else if (err) {
        responseData.status=false,
        res.statusCode = 200;
        responseData.message = err
				return res.json(responseData);
      } else if(req.body){
        const data = req.body;
        const farmer = await models.farmer.findOne(
          {
            where:{
              phoneNumber:data.phoneNumber
            }
          }
        );
        if(farmer){
          responseData.message  = "Account already exist"
          responseData.data = farmer;
          return res.json(responseData);
        }
        const createFarmer = await models.farmer.create(
          {
            id:uuid.v4(),
            photoId:req.file.path[0],
            //Biometrics
            firstname :data.firstname,
            lastname:data.lastname,
            address:data.address,
            state:data.state,
            phoneNumber:data.phoneNumber,
            signature:req.file.path[1]
          }
        )
        if(createFarmer){
          responseData.message  = "Account Created"
          responseData.data = createFarmer;
          return res.json(responseData);
        }
      }else{
        responseData.message  ='empty post';
        return res.json(responseData);
      }
    })
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
  
}

const updateSHFAccount = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isUser = await models.farmer.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isUser){
    multerConfig.multipleUpload(req, res, async function(err) {
			if (err instanceof multer.MulterError) {
        responseData.status = false,
        res.statusCode = 200;
        responseData.message = err.message  + "something went wrong"
				return res.json(responseData);
			} else if (err) {
        responseData.status=false,
        res.statusCode = 200;
        responseData.message = err
				return res.json(responseData);
      } else if(req.body){
        const data = req.body
        console.log(data.id)
        if(isUser){
          const createFarmer = await models.farmer.update(
            {
              photoId:req.file.path[0],
              //Biometrics
              firstname :data.firstname,
              lastname:data.lastname,
              address:data.address,
              state:data.state,
              phoneNumber:data.phoneNumber,
              signature:req.file.path[1]
            },
            {
              where:{
                id:user.id
              }
            }
          )
        } else
        {
          const createFarmer = await models.farmer.update(
            {
              photoId:req.file.path[0],
              //Biometrics
              firstname :data.firstname,
              lastname:data.lastname,
              address:data.address,
              state:data.state,
              phoneNumber:data.phoneNumber,
              signature:req.file.path[1]
            },
            {
              where:{
                id:data.id
              }
            }
          )
        }
        res.statusCode = 200;
        responseData.message  = "Account updated"
        return res.json(responseData);
      }else{
        res.statusCode = 200;
        responseData.message  ='empty post';
        return res.json(responseData);
      }
    })
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const deleteSHFAccount = async (req,res)=>{
  const user = req.user;
  const data =req.body;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isUser = await models.farmer.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isUser){
    if(isUser){
      await models.farmer.destroy(
        {
          where:{
            id:user.id
          }
        }
      );

    }
    if(isAdmin){
      await models.farmer.destroy(
        {
          where:{
            id:data.id
          }
        }
      );
    }
    responseData.status = true;
    res.statusCode = 200;
    responseData.message = "Account deleted"
    res.json(responseData);
  }else{
    responseData.status = false;
    res.statusCode = 401
    res.json("Unauthorize");
  }
}

const getSHFAccount = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isUser = await models.farmer.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isUser){
    if(isUser){
      responseData.message  = "completed"
      responseData.data = isUser;
      return res.json(responseData);
    }
    if(isAdmin){
      const data = req.body
      const user = await models.farmer.findOne(
        {
          where:{
            id:data.id
          }
        }
      );
      responseData.message  = "completed"
      responseData.data = user;
      return res.json(responseData);
    }
  }
  responseData.status = false;
  res.statusCode = false
  return res.json("Unauthorize");
}
const getAllSHFAccount = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isSuperAdmin = await models.superAdmin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isSuperAdmin){
    const data = req.body;
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const count = await models.farmer.count();
    const farmers = await models.farmer.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
      }
    );
    responseData.message  = "completed"
    responseData.data = farmers;
    responseData.numberOfFarmers = count;
    return res.json(responseData);
  
  }
  responseData.status = false;
  res.statusCode = false
  return res.json("Unauthorize");
}


const farmerLogin =async (req,res) => {
  const data = req.body;
  const phoneNumber = data.phoneNumber;
  const pin = data.pin;
  const farmer = await models.farmer.findOne(
    {
      where:{
        phoneNumber:phoneNumber
      }
    }
  );
  if(farmer){
    const hasPin = farmer.hasPin;
    if(!hasPin){
      const code = `Hello ${farmer.firstname}you need to answer the question ${farmer.secretQuestion} to set your pin`
      const phoneNumber = farmer.phoneNumber;
      await smsGlobal.sendMessage(process.env.FARMER_HQ_NUMBER,phoneNumber,code);
      responseData.message = `A message was sent to ${phoneNumber}`;
      responseData.status = false ;
      return res.json(responseData);
    }
    const checkPin = bcrypt.compareSync(pin, farmer.pin);
    if (!checkPin) {
      responseData.message = 'Incorrect pin';
      responseData.status = false;
      return res.json(responseData)
    } else {
      const jwt_payload ={
        id:farmer.id,
      }
      await models.isLoggedOut.destroy(
        {
          where:{
            farmerId:farmer.id
          }
        }
      ) 
        const token = jwt.sign(jwt_payload,process.env.SECRET);
        farmer.password = null;
        return res.json(
          { "token":token,
            "data":farmer,
            "statusCode":200,
            "status": 'success'
          }
        )
    }
  }
  res.statusCode = 200;
  responseData.status = false;
  responseData.message = "there is no farmer with this phoneNumber";
  return res.json(responseData);
}

const createPin = async (req,res) =>{
  const data = req.body;
  const answer = data.answer;
  const farmer = await models.farmer.findOne(
    {
      where:{
        secretAnswer:answer
      }
    }
  );
  if(farmer){
    if(!data.pin == data.confirmPin){
      responseData.message = 'pin and cornfirm pin doesn\'t match';
      responseData.status = false;
      return res.json(responseData)
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(data.pin,salt)
    const updateFarmer = await models.farmer.update(
      {
        hasPin:true,
        pin:hash
      },
      {
        where:{
          id:farmer.id
        }
      }
    );
    responseData.status = true;
    responseData.message = 'Pin set';
    responseData.status = false;
    return res.json(responseData)
  }
  responseData.message = 'Incorrect pin';
  responseData.status = false;
  return res.json(responseData)
}

const farmerLogout = async(req,res)=>{
  await models.isLoggedOut.create({id:uuid.v4(),farmerId:req.user.id,status:true});
  res.json("logged out");
};
module.exports = {
  createSHFAccount,
  updateSHFAccount,
  deleteSHFAccount,
  getSHFAccount,
  getAllSHFAccount,
  farmerLogin,
  farmerLogout,
  createPin
}
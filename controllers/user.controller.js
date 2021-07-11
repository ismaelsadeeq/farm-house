const uuid = require('uuid');
const bcrypt = require('bcrypt')
const helpers = require('../utilities/helpers');
const models = require('../models')
const multer = require('multer');
const jwt = require('jsonwebtoken');
const multerConfig = require('../config/multer');
const smsGlobal = require('../utilities/sms.api')
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
            photoId:req.file.path,
            //Biometrics
            firstname :data.firstname,
            lastname:data.lastname,
            address:data.address,
            state:data.state,
            bvnNumber:data.bvnNumber,
            accountNumber:data.accountNumber,
            hasPin :false,
            bank:data.bank,
            phoneNumber:data.phoneNumber
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
        const data = req.body
        console.log(data.id)
        if(isUser){
          const createFarmer = await models.farmer.update(
            {
              photoId:req.file.path,
              //Biometrics
              firstname :data.firstname,
              lastname:data.lastname,
              address:data.address,
              state:data.state,
              bank:data.bank,
              bvnNumber:data.bvnNumber,
              accountNumber:data.accountNumber,
              phoneNumber:data.phoneNumber
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
              photoId:req.file.path,
              //Biometrics
              firstname :data.firstname,
              lastname:data.lastname,
              address:data.address,
              state:data.state,
              bank:data.bank,
              bvnNumber:data.bvnNumber,
              accountNumber:data.accountNumber,
              phoneNumber:data.phoneNumber
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
      const code = helpers.generateOTP();
      const phoneNumber = farmer.phoneNumber;
      await smsGlobal.sendMessage(process.env.FARMER_HQ_NUMBER,phoneNumber,code);
      await models.otpCode.create(
        {
          id:uuid.v4(),
          code:code,
          farmerId:farmer.id
        }
      );
      responseData.message = `A code was sent to ${phoneNumber}`;
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
  const code = data.code;
  const isCode = await models.otpCode.findOne(
    {
      where:{
        code:code
      }
    }
  );
  if(isCode){
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
          id:isCode.farmerId
        }
      }
    );
    const deleteCode = await models.otpCode.destroy(
      {
        where:{
          code:data.code
        }
      }
    );
    responseData.message = 'Pin set go to login';
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
  farmerLogin,
  farmerLogout,
  createPin
}
const uuid = require('uuid');
const models = require('../models')
const multer = require('multer');
const multerConfig = require('../config/multer');
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
        const data = req.body
        const createFarmer = await models.farmer.create(
          {
            id:uuid.v4(),
            photoId:req.file,
            //Biometrics
            firstname :data.firstname,
            lastname:data.lastname,
            address:data.address,
            state:data.state,
            bvnNumber:data.bvnNumber,
            accountNumber:data.accountNumber,
            phoneNumber:data.phoneNumber
          }
        )
        if(createFarmer){
          res.statusCode = 200;
          responseData.message  ="Account Created"
          responseData.data = createFarmer;
          return res.json(responseData);
        }
      }else{
        res.statusCode = 200;
        responseData.message  ='empty post';
        res.json(responseData);
      }
    })
  }
  responseData.status = false;
  res.statusCode = false
  res.json("Unauthorize");
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
        if(isUser){
          const createFarmer = await models.farmer.update(
            {
              photoId:req.file,
              //Biometrics
              firstname :data.firstname,
              lastname:data.lastname,
              address:data.address,
              state:data.state,
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
              photoId:req.file,
              //Biometrics
              firstname :data.firstname,
              lastname:data.lastname,
              address:data.address,
              state:data.state,
              bvnNumber:data.bvnNumber,
              accountNumber:data.accountNumber,
              phoneNumber:data.phoneNumber
            },
            {
              where:{
                id:req.body.id
              }
            }
          )
        }
        if(createFarmer){
          res.statusCode = 200;
          responseData.message  ="Account Created"
          responseData.data = createFarmer;
          return res.json(responseData);
        }
      }else{
        res.statusCode = 200;
        responseData.message  ='empty post';
        res.json(responseData);
      }
    })
  }
  responseData.status = false;
  res.statusCode = false
  res.json("Unauthorize");
}

const deleteSHFAccount = async (req,res)=>{
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
  }
  responseData.status = false;
  res.statusCode = false
  res.json("Unauthorize");
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
    const user = await models.farmer.findOne(
        {
          where:{
            id:user.id
          }
        }
      );
    }
    if(isAdmin){
      const user = await models.farmer.findOne(
        {
          where:{
            id:data.id
          }
        }
      );
    }
  }
  responseData.status = false;
  res.statusCode = false
  res.json("Unauthorize");
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
module.exports = {
  createSHFAccount,
  updateSHFAccount,
  deleteSHFAccount,
  getSHFAccount,
  farmerLogin
}
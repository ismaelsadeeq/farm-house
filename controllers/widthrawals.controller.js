//imports
const models = require('../models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const helpers = require('../utilities/helpers')
require('dotenv').config();

//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const getAWidthrawal = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const widthrawal = await models.productWidthrawal.findOne(
      {
        where:{
          id:id
        },
        include:[
          {model:models.storage},
          {model:models.farmer}
        ],
      }
      
    );
    if(!widthrawal) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = widthrawal;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getAFarmerWidthrawal = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const widthrawal = await models.productWidthrawal.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          farmerId:id
        }
      }
      
    );
    if(!widthrawal) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = widthrawal;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}


module.exports = {
  getAWidthrawal,
  getAFarmerWidthrawal
}
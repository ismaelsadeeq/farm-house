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


const createCenter = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const data = req.body;
    const miniProcessingCenter = await models.miniProcessingCenter.create(
      {
        id:uuid.v4(),
        name:data.name,
        state:data.state,
        localGovernment:data.localGovernment,
        address:data.address,
        description:data.description,
        category:data.category
      }
    );
    if(!miniProcessingCenter) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "mini processing center created";
    responseData.status = true;
    responseData.data = miniProcessingCenter;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const editCenter = async (req,res)=>{
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
    const data = req.body;
    const miniProcessingCenter = await models.miniProcessingCenter.create(
      {
        name:data.name,
        state:data.state,
        localGovernment:data.localGovernment,
        address:data.address,
        description:data.description,
        category:data.category
      },
      {
        where:{
          id:id
        }
      }
    );
    responseData.message = "mini processing center updated";
    responseData.status = true;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getCenter = async (req,res)=>{
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
    const miniProcessingCenter = await models.miniProcessingCenter.findOne(
      {
        where:{
          id:id
        },
        attributes:['id','name','state','localGovernment','address','description','category']
      }
      
    );
    if(!miniProcessingCenter) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "mini processing center created";
    responseData.status = true;
    responseData.data = miniProcessingCenter;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getAllCenter = async (req,res)=>{
  const user = req.user;
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
    const count = await models.miniProcessingCenter.count();
    const miniProcessingCenter = await models.miniProcessingCenter.findAll(
      {
        order:[['createdAt','DESC']],
        attributes:['id','name','state','localGovernment','address','description','category'],
        offset:skip,
        limit:pageLimit
      }
      
    );
    if(!miniProcessingCenter) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.count = count;
    responseData.data = miniProcessingCenter;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const deleteCenter = async (req,res)=>{
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
    const miniProcessingCenter = await models.miniProcessingCenter.destroy(
      {
        where:{
          id:id
        }
      }
      
    );
    if(!miniProcessingCenter) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "mini processing center deleted";
    responseData.status = true;
    responseData.data = miniProcessingCenter;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

module.exports = {
  createCenter,
  editCenter,
  getCenter,
  getAllCenter,
  deleteCenter
}


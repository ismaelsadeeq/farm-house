//imports
const models = require('../models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const helpers = require('../utilities/helpers');
const smsGlobal = require('../utilities/sms.api');
const wooCommerce = require('../config/wooCommerce').WooCommerce

require('dotenv').config();

//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const createCategory = async (req,res)=>{
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
    const category = await models.category.create(
      {
        id:uuid.v4(),
        name:data.name,
        description:data.description
      }
    );
    if(!category){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData)  
    }
    const payload = {
      id:category.id,
      name:category.name,
      description:category.description
    }
    wooCommerce.post("products/categories", payload)
    .then( async (response) => {
      await models.category.update(
        {
          wooCommerceId:response.data.id
        },
        {
          where:{
            id:category.id
          }
        }
      )
      responseData.message = "category created";
      responseData.status = true;
      responseData.data = category;
      return res.json(responseData)
    })
    .catch((error) => {
      console.log(error.response.data);
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData) 
    });
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const editCategory = async (req,res)=>{
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
    const updateCategory = await models.category.update(
      {
        name:data.name,
        description:data.description
      },
      {
        where:{
          id:req.params.id
        }
      }

    );
    if(!updateCategory){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData)  
    }
    const payload = {
      name:data.name,
      description:data.description
    }
    const category = await models.category.findOne(
      {
        where:{
          id:req.params.id
        }
      }
    )
    wooCommerce.put(`products/categories/${category.wooCommerceId}`, payload)
    .then( async (response) => {
      console.log(response.data)
      responseData.message = "category updated";
      responseData.status = true;
      responseData.data = category;
      return res.json(responseData)
    })
    .catch((error) => {
      console.log(error.response.data);
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData) 
    });
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const deleteCategory = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const category = await models.category.findOne(
      {
        where:{
          id:req.params.id
        }
      }
    )
    const deleteCategory = await models.category.destroy(
      {
        where:{
          id:req.params.id
        }
      }

    );
    if(!deleteCategory){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData)  
    }
    wooCommerce.delete(`products/categories/${category.wooCommerceId}`, 
    {
      force:true
    })
    .then( async (response) => {
      console.log(response.data)
      responseData.message = "category deleted";
      responseData.status = true;
      responseData.data = category;
      return res.json(responseData)
    })
    .catch((error) => {
      console.log(error.response.data);
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData) 
    });
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getCategory = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const category = await models.category.findOne(
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!category){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData)
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = category;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getAllCategories = async (req,res)=>{
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
    const category = await models.category.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
      }
    );
    if(!category){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = undefined;
      return res.json(responseData)
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = category;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
}
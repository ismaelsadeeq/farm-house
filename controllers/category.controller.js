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
    const data = {
      id:category.id,
      name:category.name,
      description:category.description
    }
    wooCommerce.post("products/categories", data)
    .then((response) => {
      await models.ud
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const editCategory = async (req,res)=>{
  
}
const deleteCategory = async (req,res)=>{
  
}
const getCategory = async (req,res)=>{
  
}
const getAllCategories = async (req,res)=>{
  
}

module.exports = {
  createCategory,
  editCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
}
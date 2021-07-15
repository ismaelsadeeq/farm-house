const uuid = require('uuid');
const bcrypt = require('bcrypt')
const helpers = require('../utilities/helpers');
const models = require('../models')
const multer = require('multer');
const multerConfig = require('../config/multer');
const smsGlobal = require('../utilities/sms.api');

require('dotenv').config();

const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const addLoanCategory = async (req,res)=>{
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
    const addLoanCategory = await models.loanCategory.create(
      {
        id:uuid.v4(),
        loanName:data.loanName,
        loanType:data.loanType,
        loanBenefit:data.loanBenefit,
        repaymentPrice:data.repaymentPrice,
        repaymentPeriod:data.repaymentPeriod
      }
    );
    if(!addLoanCategory){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "loan category created";
    responseData.status = true;
    responseData.data = addLoanCategory;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const editLoanCategory = async (req,res)=>{
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
    const addLoanCategory = await models.loanCategory.update(
      {
        loanName:data.loanName,
        loanType:data.loanType,
        loanBenefit:data.loanBenefit,
        repaymentPrice:data.repaymentPrice,
        repaymentPeriod:data.repaymentPeriod
      },
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!addLoanCategory){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "loan category updated";
    responseData.status = true;
    responseData.data = null;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const deleteLoanCategory = async (req,res)=>{
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
    const addLoanCategory = await models.loanCategory.destroy(
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!addLoanCategory){
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "loan category deleted";
    responseData.status = true;
    responseData.data = addLoanCategory;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getLoanCategory = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const loanCategory = await models.loanCategory.findOne(
      {
        where:{
          id:req.params.id
        },
        attributes:['id','loanName','loanType','loanBenefit','repaymentPrice','repaymentPeriod']
      }
    );
    if(!loanCategory){
      responseData.message = `There is no loan category with the id ${req.params.id}`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loanCategory;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getLoanCategories = async (req,res)=>{
  const currentPage = parseInt(req.query.currentPage);
  const pageLimit = parseInt(req.query.pageLimit);
  const skip = currentPage * pageLimit;
  const loanCategories = await models.loanCategory.findAll(
    {
      order:[['createdAt','DESC']],
      offset:skip,
      limit:pageLimit,
      attributes:['id','loanName','loanType','loanBenefit','repaymentPrice','repaymentPeriod']
    }
  );
  if(!loanCategories){
    responseData.message = `Something Went wrong`;
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData)  
  }
  responseData.message = "completed";
  responseData.status = true;
  responseData.data = loanCategories;
  return res.json(responseData)
}
module.exports = {
  addLoanCategory,
  editLoanCategory,
  deleteLoanCategory,
  getLoanCategory,
  getLoanCategories
}
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

const getApproveNotGivenLoans = async (req,res)=>{
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
    const loans = await models.loan.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          isApproved:true,
          isGiven:false
        }
      }
    );
    if(!loans){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loans;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getApproveGivenLoans = async (req,res)=>{
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
    const loans = await models.loan.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          isApproved:true,
          isGiven:true
        }
      }
    );
    if(!loans){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loans;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getApproveNotPaidLoans = async (req,res)=>{
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
    const loans = await models.loan.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          isApproved:true,
          isGiven:true,
          isPaid:false
        }
      }
    );
    if(!loans){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loans;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getApprovePaidLoans = async (req,res)=>{
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
    const loans = await models.loan.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          isApproved:true,
          isGiven:true,
          isPaid:true
        }
      }
    );
    if(!loans){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loans;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const unApprovedLoans = async (req,res)=>{
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
    const loans = await models.loan.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit
      }
    );
    if(!loans){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loans;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getLoan = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const loan = await models.loan.findOne(
      {
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loan;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const applyLoan = async (req,res)=>{
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
    const loan = await models.loan.create(
      {
        id:uuid.v4(),
        farmerId:req.params.id,
        loanCategoryId:req.params.categoryId,
        reasonForApplication:data.reasonForApplication
      }
    )
    if(!loan){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = loan;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const applyLoanUssd = async (req,res)=>{
  const data = req.body;
  const phoneNumber = data.phoneNumber;
  const farmer = await models.farmer.findOne(
    {
      where:{
        phoneNumber:phoneNumber
      }
    }
  );
  if(!farmer){
    responseData.message = `There is no farmer with this phone number`;
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData); 
  }
  const apply = await models.loan.create(
    {
      id:uuid.v4(),
      farmerId:farmer.id,
      loanCategoryId:req.params.id,
      reasonForApplication:data.reasonForApplication
    }
  );
  if(!apply){
    responseData.message = `Something went wrong`;
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData)  
  }
  responseData.message = `loan application successful`;
  responseData.status = true;
  responseData.data = apply;
  return res.json(responseData)  
}
const approveLoan = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const loan = await models.loan.update(
      {
        isApproved:true,
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "Loan Approved";
    responseData.status = true;
    responseData.data = null;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const declineLoan = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const loan = await models.loan.update(
      {
        isApproved:false,
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "Loan Approved";
    responseData.status = true;
    responseData.data = null;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const issueLoan = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const loan = await models.loan.update(
      {
        isGiven:true,
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "Loan status changed to given";
    responseData.status = true;
    responseData.data = null;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const payLoan = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const loan = await models.loan.update(
      {
        isPaid:true,
        where:{
          id:req.params.id
        }
      }
    );
    if(!loan){
      responseData.message = `Something went wrong`;
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "Loan Status Changed to paid";
    responseData.status = true;
    responseData.data = null;
    return res.json(responseData)
  
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

module.exports = {
  getApproveNotGivenLoans,
  getApproveGivenLoans,
  getApproveNotPaidLoans,
  getApprovePaidLoans,
  unApprovedLoans,
  getLoan,
  applyLoanUssd,
  applyLoan,
  approveLoan,
  declineLoan,
  issueLoan,
  payLoan
}
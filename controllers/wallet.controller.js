const uuid = require("uuid");
const models = require("../models"); 
const bcrypt = require("bcrypt");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const mailer = require("../utilities/mailjet");
const helpers = require("../utilities/helpers");
const paystackApi = require('../utilities/paystack.api');
require("dotenv").config();
const mailjet = require ("node-mailjet").connect(process.env.MAILJET_PUBLIC,process.env.MAILJET_PRIVATE);

const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const nubanWebhook =async (req,res)=>{
  //validate event
  let hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  console.log(hash);
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    let data = req.body;
 
    //fund successfull
    if(data.event === "customeridentification.failed"){
      const wallet = await models.wallet.findOne(
        {
          where:{
            customerCode:data.data.customer_code
          }
        }
      );
      await models.user.update(
        {
          isBvnVerified:false
        },
        {
          where:{
            id:wallet.userId
          }
        }
      );
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = null;
      return res.json(responseData)
    }
    if(data.event === "customeridentification.success"){
      const wallet = await models.wallet.findOne(
        {
          where:{
            customerCode:data.data.customer_code
          }
        }
      );
      await models.user.update(
        {
          isBvnVerified:true
        },
        {
          where:{
            id:wallet.userId
          }
        }
      );
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = null;
      return res.json(responseData)
    }
    if(data.event === "charge.success"){
      const wallet = await models.wallet.findOne(
        {
          where:{
            customerCode:data.data.customer.customer_code
          }
        }
      );
      const transaction = await  models.transaction.create(
        {
          id:uuid.v4(),
          userId:wallet.userId,
          transactionType:"credit",
          status:true,
          amount:parseFloat(data.data.amount) / 100, //the amount in in kobo
          time:data.data.paid_at
        }
      );
      const updateWallet = await models.wallet.update(
        {
          accountBalance:parseFloat(wallet.accountBalance) + parseFloat(data.data.amount)/100,
        },
        {
          where:{
            userId:wallet.userId
          }
        }
      )
      responseData.message = "Success";
      responseData.status = true;
      responseData.data = null;
      return res.json(responseData)
    }
    responseData.message = "Invalid payload";
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData)
    
  }
  
  res.statusCode = 401;
	return res.json('unauthorize')
}
const sendEmail= (data)=>{
  const sendMail = mailer.sendMail(data.email, data.variables,data.msg)
 if(sendMail){
 return true
 } else{
   return false
 }
}
const getBalanceWithToken = async (req,res)=>{
  const key = req.headers.authorization;
  const email = req.body.email;
  if(!key){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let plainPublicKey = key.substring(6,key.length);
  const encryptedPublickey = helpers.encrypt(plainPublicKey);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:encryptedPublickey,
        email:email
      }
    }
  );
  if(!user){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      },
      attributes:['id','accountBalance']
    }
  );
  if(!wallet){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = wallet
  return res.json(responseData);
}
const getBalance = async (req,res)=>{
  const user = req.user;
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      },
      attributes:['id','accountBalance']
    }
  );
  if(!wallet){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = wallet
  return res.json(responseData);
}
const getAccountDetails = async (req,res)=>{
  const user = req.user;
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      },
      attributes:['id','bank','accountNumber','accountName','userId']
    }
  );
  if(!wallet){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = wallet
  return res.json(responseData);
}
const getAccountDetailsWithAPI = async (req,res)=>{
  const key = req.headers.authorization;
  const email = req.body.email
  if(!key){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let plainPublicKey = key.substring(6,key.length);
  const encryptedPublickey = helpers.encrypt(plainPublicKey);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:encryptedPublickey,
        email:email
      }
    }
  );
  if(!user){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      },
      attributes:['id','bank','accountNumber','accountName','userId']
    }
  );
  if(!wallet){
    responseData.status = false;
    responseData.message = "something went wrong";
    responseData.data = null
    return res.json(responseData);
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = wallet
  return res.json(responseData);
}
const buyACommodity = async (req,res)=>{
  const commodityId = req.params.commodityId;
  const deliveryAddressId = req.params.deliveryAddressId
  const data = req.body;
  const key = req.headers.authorization;
  if(!key){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let plainPublicKey = key.substring(6,key.length);
  const encryptedPublickey = helpers.encrypt(plainPublicKey);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:encryptedPublickey,
        email:data.email
      }
    }
  );
  if(!user){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  const wallet = await models.wallet.findOne(
    {
      where:{
        userId:user.id
      }
    }
  );
  const deliveryAddressExist = await models.deliveryAddress.findOne(
    {
      where:{
        id:deliveryAddressId
      }
    }
  );
  if(!deliveryAddressExist){
    responseData.status = false;
    responseData.message = "incorrect deliveryAddressId";
    responseData.data = null
    return res.json(responseData);
  }
  const inventory = await models.inventory.findOne(
    {
      where:{
        id:commodityId
      }
    }
  );
  if(!inventory){
    responseData.status = false;
    responseData.message = "commodity with doesn't exist";
    responseData.data = null
    return res.json(responseData);
  }
  let walletBalance = parseFloat(wallet.accountBalance);
  const numberOfProduct = data.numberOfCommodities;
  let commodityPrice = parseFloat(inventory.pricePerUnit) * parseFloat(numberOfProduct)
  if(commodityPrice>walletBalance){
    responseData.status = false;
    responseData.message = "Insufficient Balance";
    responseData.data = undefined
    return res.json(responseData);
  }
  walletBalance -= commodityPrice;
  const updateWallet =  await models.wallet.update(
    {
      accountBalance:walletBalance
    },
    {
      where:{
        userId:user.id
      }
    }
  );
  const newNumberOfProduct = parseFloat(inventory.numberOfProduct) - parseFloat(numberOfProduct);
  const newCommulativePrice = newNumberOfProduct * parseFloat(inventory.pricePerUnit)
  const updateInventory = await models.inventory.create(
    {
      numberOfProduct:newNumberOfProduct,
      cummulativeProductPrice:newCommulativePrice
    },
    {
      where:{
        id:commodityId
      }
    }
  );
  let date = new Date();
  date = date.toLocaleString();
  const createSoldProduct = await models.soldProduct.create(
    {
      id:uuid.v4(),
      inventoryId:commodityId,
      deliveryAddressId:deliveryAddressId,
      productName:inventory.productName,
      numberOfProduct:numberOfProduct,
      priceUnit:inventory.productUnit,
      productPerUnit:inventory.pricePerUnit,
      cummulativeProductPrice:parseFloat(numberOfProduct) * parseFloat(inventory.pricePerUnit),
      time:date
    }
  );
  responseData.status = true;
  responseData.message = "commodity purchased successful";
  responseData.data = createSoldProduct;
  return res.json(responseData);
}
const getPurchasedCommodities = async (req,res)=>{
  const user = req.user;
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit
  const purchasedCommodities = await models.soldCommodities.findAll(
    {
      order:[['createdAt','DESC']],
			offset:skip,
			limit:pageLimit,
      where:{
        userId:user.id
      }
    }
  );
  if(!purchasedCommodities){
    responseData.status = false;
    responseData.message = "no purchased commodities at the moment";
    responseData.data = null;
    return res.json(responseData)
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = purchasedCommodities;
  return res.json(responseData);
}
const getPurchasedCommoditiesWithAPI = async (req,res)=>{
  const key = req.headers.authorization;
  const email = req.body.email
  if(!key){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let plainPublicKey = key.substring(6,key.length);
  const encryptedPublickey = helpers.encrypt(plainPublicKey);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:encryptedPublickey,
        email:email
      }
    }
  );
  if(!user){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let pageLimit = parseInt(req.query.pageLimit);
  let currentPage = parseInt(req.query.currentPage);
  let	skip = currentPage * pageLimit
  const purchasedCommodities = await models.soldCommodities.findAll(
    {
      order:[['createdAt','DESC']],
			offset:skip,
			limit:pageLimit,
      where:{
        userId:user.id
      }
    }
  );
  if(!purchasedCommodities){
    responseData.status = false;
    responseData.message = "no purchased commodities at the moment";
    responseData.data = null;
    return res.json(responseData)
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = purchasedCommodities;
  return res.json(responseData);
}
const getPurchasedCommodityWithAPI = async (req,res)=>{
  const key = req.headers.authorization;
  const email = req.body.email
  const id = req.params.soldCommodityId
  if(!key){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let plainPublicKey = key.substring(6,key.length);
  const encryptedPublickey = helpers.encrypt(plainPublicKey);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:encryptedPublickey,
        email:email
      }
    }
  );
  if(!user){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  const purchasedCommodities = await models.soldCommodities.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!purchasedCommodities){
    responseData.status = false;
    responseData.message = "no purchased commodities at the moment";
    responseData.data = null;
    return res.json(responseData)
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = purchasedCommodities;
  return res.json(responseData);
}
const getPurchasedCommodity = async (req,res)=>{
  const id = req.params.id;
  const purchasedCommodity = await models.soldCommodities.findOne(
    {
      where:{
        id:id
      }
    }
  );
  if(!purchasedCommodity){
    responseData.status = false;
    responseData.message = "no purchased commodities at the moment";
    responseData.data = null;
    return res.json(responseData)
  }
  responseData.status = true;
  responseData.message = "completed";
  responseData.data = purchasedCommodity;
  return res.json(responseData);
}
module.exports = {
  nubanWebhook,
  getBalanceWithToken,
  getBalance,
  getAccountDetails,
  getAccountDetailsWithAPI,
  buyACommodity,
  getPurchasedCommodities,
  getPurchasedCommoditiesWithAPI,
  getPurchasedCommodityWithAPI,
  getPurchasedCommodity
}
const uuid = require("uuid");
const models = require("../models"); 
const bcrypt = require("bcrypt");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const mailer = require("../utilities/mailjet");
const helpers = require("../utilities/helpers");
const paystackApi = require('../utilities/paystack.api');
const crypto = require('crypto');
const wooCommerce = require('../config/wooCommerce').WooCommerce;
require("dotenv").config();
const mailjet = require ("node-mailjet").connect(process.env.MAILJET_PUBLIC,process.env.MAILJET_PRIVATE);

const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const nubanWebhook =async (req,res)=>{
  //validate event
  let hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');
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
const getBalanceWithToken = async (req,res)=>{
  const key = req.headers.authorization;
  const email = req.body.email;
  if(!key){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let publicKey = key.substring(7,key.length);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:publicKey,
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
  let publicKey = key.substring(7,key.length);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:publicKey,
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
  const deliveryAddressId = req.body.deliveryAddressId
  const data = req.body;
  const key = req.headers.authorization;
  if(!key){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  let publicKey = key.substring(7,key.length);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:publicKey,
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
    responseData.message = "commodity doesn't exist";
    responseData.data = undefined
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
  const updateInventory = await models.inventory.update(
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
  await models.productStorage.update(
    {
      numberOfProduct:newNumberOfProduct
    },
    {
      where:{
        id:inventory.productStorageId
      }
    }
  );
  if(newNumberOfProduct == 0){
    await models.inventory.destroy(
      {
        where:{
          id:inventory.id
        }
      }
    );
    await productStorage.destroy(
      {
        where:{
          id:inventory.productStorageId
        }
      }
    );
    wooCommerce.delete(`products/${inventory.wooCommerceProductId}` , {
      force: true
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }
  let date = new Date();
  date = date.toLocaleString();
  const createSoldProduct = await models.soldCommodity.create(
    {
      id:uuid.v4(),
      userId:wallet.userId,
      inventoryId:commodityId,
      deliveryAddressId:deliveryAddressId,
      productName:inventory.productName,
      numberOfProduct:numberOfProduct,
      productUnit:inventory.productUnit,
      pricePerUnit:inventory.pricePerUnit,
      cummulativeProductPrice:parseFloat(numberOfProduct) * parseFloat(inventory.pricePerUnit),
      time:date
    }
  );
  const farmerWallet = await models.farmerWallet.findOne(
    {
      farmerId:inventory.farmerId
    }
  );
  let purchasedCommodityPrice = parseFloat(numberOfProduct) * parseFloat(inventory.pricePerUnit)
  if(!farmerWallet){
    const createWallet = await models.farmerWallet.create(
      {
        id:uuid.v4(),
        farmerId:inventory.farmerId,
        balance:purchasedCommodityPrice
      }
    );
  }else{
    await models.wallet.update(
      {
        balance:parseFloat(wallet.balance) + purchasedCommodityPrice
      },
      {
        where:{
          farmerId:inventory.farmerId
        }
      }
    )
  }
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
  const purchasedCommodities = await models.soldCommodity.findAll(
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
  let publicKey = key.substring(7,key.length);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:publicKey,
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
  const purchasedCommodities = await models.soldCommodity.findAll(
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
  let publicKey = key.substring(7,key.length);
  const user = await models.user.findOne(
    {
      where:{
        publicKey:publicKey,
        email:email
      }
    }
  );
  if(!user){
    res.statusCode = 401;
	  return res.json('unauthorize');
  }
  const purchasedCommodities = await models.soldCommodity.findOne(
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
  const id = req.params.soldCommodityId
  const purchasedCommodity = await models.soldCommodity.findOne(
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
const getFarmerWallet = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const farmer = await models.farmer.findOne(
      {
        where:{
          id:req.params.farmerId
        }
      }
    );
    if(farmer){
      const wallet = await models.farmerWallet.findOne(
        {
          where:{
            farmerId:farmer.id
          }
        }
      );
      if(!wallet){
        responseData.message = "farmer does not have a sale";
        responseData.status = true;
        responseData.data = undefined;
        return res.json(responseData);
      }
      responseData.message = "completed";
      responseData.status = true;
      responseData.data = wallet;
      return res.json(responseData);
    } else{
      responseData.message = "incorrect farmer id";
      responseData.status = false;
      res.statusCode = 200
      return res.json(responseData);
    }
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getFarmerWalletUSSD = async (req,res)=>{
  const data = req.body;
  const farmer = await models.farmer.findOne(
    {
      where:{
        phoneNumber:data.phoneNumber
      }
    }
  );
  if(farmer){
    const wallet = await models.farmerWallet.findOne(
      {
        where:{
          farmerId:farmer.id
        }
      }
    );
    if(!wallet){
      responseData.message = "farmer does not have a sale";
      responseData.status = true;
      responseData.data = undefined;
      return res.json(responseData);
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = wallet;
    return res.json(responseData);
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const farmerWidthrawMoney = async (req,res)=>{
  const user = req.user;
  const amount = parseFloat(req.body.amount);
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    if(amount<0){
      responseData.message = "cannot widthraw negative amount";
      responseData.status = false;
      res.statusCode = 200
      return res.json(responseData);
    }
    const farmer = await models.farmer.findOne(
      {
        where:{
          id:req.params.farmerId
        }
      }
    );
    if(farmer){
      const wallet = await models.farmerWallet.findOne(
        {
          where:{
            farmerId:farmer.id
          }
        }
      );
      if(!wallet){
        responseData.message = "farmer doesnt have a sale yet";
        responseData.status = false;
        res.statusCode = 200
        return res.json(responseData);
      }
      if(parseFloat(wallet.balance) < amount){
        responseData.message = "insufficient funds";
        responseData.status = false;
        res.statusCode = 200
        return res.json(responseData);
      }
      await models.farmerWallet.update(
        {
          balance:parseFloat(wallet.balance) - amount
        },
        {
          where:{
            farmerId:farmer.id
          }
        }
      );
      let time = new Date()
      time = time.toLocaleString()
      await models.transaction.create(
        {
          id:uuid.v4(),
          farmerId:farmer.id,
          transactionType:"debit",
          amount:amount,
          status:true,
          time:time
        }
      );
      responseData.message = "withdrawal successful";
      responseData.status = false;
      res.statusCode = 200
      return res.json(responseData);
    } else{
      responseData.message = "incorrect farmer id";
      responseData.status = false;
      res.statusCode = 200
      return res.json(responseData);
    }
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
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
  getPurchasedCommodity,
  getFarmerWallet,
  getFarmerWalletUSSD,
  farmerWidthrawMoney
}
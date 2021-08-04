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

const storeProduct = async (req,res)=>{
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
    let dateStored = new Date();
    let dateStoredString = dateStored.toLocaleString();
    const farmer = await models.farmer.findOne(
      {
        where:{
          id:data.farmerId
        }
      }
    )
    const productStore = await models.productStorage.create(
      {
        id:uuid.v4(),
        farmerId:data.farmerId,
        categoryId:data.categoryId,
        storageAccountName:farmer.firstname,
        storageAccountNumber:helpers.generateOTP(),
        warehouseId:data.warehouseId,
        productName:data.productName,
        numberOfProduct:data.numberOfProduct,
        unit:data.unit,
        isForSale:false,
        dateStored:dateStored,
        dateStoredString:dateStoredString
      }
    );
    if(!productStore) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    let message = `Hello ${farmer.firstname} you just made a storage of ${productStore.numberOfProduct} ${productStore.unit}
     of ${productStore.productName} dated ${dateStoredString}
     Thank you
     `
    await smsGlobal.sendMessage(process.env.FARMER_HQ_NUMBER,farmer.phoneNumber,message);
    responseData.message = "storage created";
    responseData.status = true;
    responseData.data = productStore;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getAStorage = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isSuperAdmin = await models.superAdmin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isSuperAdmin){
    const store = await models.productStorage.findOne(
      {
        where:{
          id:id
        },
        include:[
          {model:models.warehouse},
          {model:models.farmer}
        ],
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getFarmerStorage = async (req,res)=>{
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
    const store = await models.productStorage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          farmerId:id
        },
        include:[
          {model:models.warehouse},
          // {model:models.farmer}
        ],
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getFarmerStorageUssd = async (req,res)=>{
  const phoneNumber = req.params.phoneNumber;
  const isFarmer = await models.farmer.findOne(
    {
      where:{
        phoneNumber:phoneNumber
      }
    }
  );
  if(isFarmer){
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const store = await models.productStorage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          farmerId:isFarmer.id
        },
        attributes:['id','productName','numberOfProduct','unit']
      }
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("There is no farmer with this phone number");
  }
}

const getWarehouseStorage = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isSuperAdmin = await models.superAdmin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isSuperAdmin){
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const store = await models.productStorage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        where:{
          warehouseId:id
        },
        include:[
          {model:models.warehouse},
          {model:models.farmer}
        ],
      }
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const getAllStorage = async (req,res)=>{
  const user = req.user;
  const id = req.params.id;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isSuperAdmin = await models.superAdmin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isSuperAdmin){
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const store = await models.productStorage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        include:[
          {model:models.warehouse},
          {model:models.farmer}
        ],
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const widthraw = async (req,res)=>{
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
    const storageId = req.params.id;
    const storage = await models.productStorage.findOne(
      {
        where:{
          id:storageId
        }
      }
    );
    let numberOfProducts = data.numberOfProducts;
    let newProductNumber = parseInt(storage.numberOfProduct) - parseInt(numberOfProducts);
    await models.productStorage.update(
      {
        numberOfProduct:newProductNumber
      },
      {
        where:{
          id:storageId
        }
      }
    );
    let currentDate = new Date();
    let dateStored = storage.dateStored;
  
    let periodOfStorage = helpers.getDifferenceInDays(dateStored,currentDate);
    periodOfStorage = Math.floor(periodOfStorage);
    const productWidthrawal = await models.productWidthrawal.create(
      {
        id:uuid.v4(),
        productStorageId:storageId,
        farmerId:storage.farmerId,
        widthrawalReason:data.widthrawalReason,
        numberOfProductWidthrawed:numberOfProducts,
        periodOfStorage:`${periodOfStorage} Days`
      }
    );
    if(!productWidthrawal){
      responseData.message = "completed";
      responseData.status = true;
      return res.json(responseData)
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = productWidthrawal;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const getProductNotForSale = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isSuperAdmin = await models.superAdmin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isSuperAdmin){
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const warehouseId = req.params.id;
    const store = await models.productStorage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        include:[
          {model:models.farmer}
        ],
        where:{
          isForsale:false,
          warehouseId:warehouseId
        }
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json(req.user);
  }
}
const getProductForSale = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  const isSuperAdmin = await models.superAdmin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin || isSuperAdmin){
    const currentPage = parseInt(req.query.currentPage);
    const pageLimit = parseInt(req.query.pageLimit);

    const skip = currentPage * pageLimit;
    const warehouseId = req.params.id;
    const store = await models.productStorage.findAll(
      {
        order:[['createdAt','DESC']],
        offset:skip,
        limit:pageLimit,
        include:[
          {model:models.farmer}
        ],
        where:{
          isForsale:true,
          warehouseId:warehouseId
        }
      }
      
    );
    if(!store) {
      responseData.message = "something went wrong";
      responseData.status = false;
      responseData.data = null;
      return res.json(responseData)  
    }
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = store;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const queryFarmer = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const storageId = req.params.storageId;
    const data = req.body;
    const productExist = await models.productStorage.findOne(
      {
        where:{
          id:storageId
        }
      }
    );
    if(productExist){
      const farmer = await models.farmer.findOne(
        {
          where:{
            id:productExist.farmerId
          }
        }
      );
      await models.productStorage.update(
        {
          peggedPrice:data.price
        },
        {
          where:{
            id:storageId
          }
        }
      );
      const message = `Hello ${farmer.firstname} your ${productExist.numberOfProduct} ${productExist.unit} of ${productExist.productName}
        is now ready to be sold in the market at ${data.price} per ${productExist.unit}, ${process.env.FARMER_MESSAGE}
        Thank you 
      `
      const farmerPhone = farmer.phoneNumber
      await smsGlobal.sendMessage(process.env.FARMER_HQ_NUMBER,farmerPhone,message);
      responseData.message = `Message sent`;
      responseData.status = true;
      responseData.data = null;
      return res.json(responseData)
    }
    responseData.message = `Commodity with id ${storageId} does not exist`;
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const changeStatusToForSale = async (req,res)=>{
  const data = req.body;
  const isUser = await models.farmer.findOne(
    {
      where:{
        phoneNumber:data.phoneNumber
      }
    }
  );
  if(!isUser){
    const storageId = req.params.storageId;
    const productExist = await models.productStorage.findOne(
      {
        where:{
          id:storageId
        }
      }
    );
    if(productExist){
      let commulativePrice = parseFloat(productExist.peggedPrice) * parseFloat(productExist.numberOfProduct)
      const category = await models.category.findOne(
        {
          where:{
            id:productExist.categoryId,
          }
        }
      )
      const payload = {
        name: productExist.productName,
        type: "simple",
        regular_price: productExist.peggedPrice,
        short_description:`One ${productExist.unit} of ${productExist.productName} is ${productExist.peggedPrice}` ,
        categories: [
          {
            id:category.wooCommerceId
          }
        ],
      };
      wooCommerce.post("products", payload)
        .then(async (response) => {
          console.log(response.data);
          await models.productStorage.update(
            {
              isForSale:true
            },{
              where:{
                id:storageId
              }
            }
          );
          const createInventory = await models.inventory.create(
            {
              id:uuid.v4(),
              farmerId:productExist.farmerId,
              categoryId:productExist.categoryId,
              productName:productExist.productName,
              productStorageId:storageId,
              wooCommerceProductId:response.data.id,
              cummulativeProductPrice:commulativePrice,
              numberOfProduct:productExist.numberOfProduct,
              productUnit:productExist.unit,
              pricePerUnit:productExist.peggedPrice
            }
          );
        })
        .catch((error) => {
          console.log(error.response);
        });
      responseData.message = "Status changed to for sale";
      responseData.status = true;
      responseData.data = null
      return res.json(responseData);
    }
    responseData.message = `Commodity with storage id ${storageId} does not exist`;
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}
const changeStatusToNotForSale = async (req,res)=>{
  const data = req.body;
  const isUser = await models.farmer.findOne(
    {
      where:{
        phoneNumber:data.phoneNumber
      }
    }
  );
  if(!isUser){
    const storageId = req.params.storageId;
    const productExist = await models.productStorage.findOne(
      {
        where:{
          id:storageId
        }
      }
    );
    if(productExist){
      const inventory = await models.inventory.findOne(
        {
          where:{
            productStorageId:storageId
          }
        }
      )
      wooCommerce.delete(`products/${inventory.wooCommerceProductId}`, {
        force: true
      })
        .then(async (response) => {
          console.log(response.data);
          await models.productStorage.update(
            {
              isForSale:false
            },{
              where:{
                id:storageId
              }
            }
          );
          await models.inventory.destroy(
            {
              where:{
                productStorageId:storageId
              }
            }
          )
        })
        .catch((error) => {
          console.log(error.response);
        });
      responseData.message = "Status Changed to not for sale";
      responseData.status = true;
      responseData.data = null
      return res.json(responseData);
    }
    responseData.message = `Commodity with id ${storageId} does not exist`;
    responseData.status = false;
    responseData.data = null;
    return res.json(responseData);
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Incorrect Phone number");
  }
}
module.exports = {
  storeProduct,
  getAStorage,
  getFarmerStorage,
  getWarehouseStorage,
  getAllStorage,
  widthraw,
  getProductNotForSale,
  getProductForSale,
  queryFarmer,
  changeStatusToForSale,
  changeStatusToNotForSale,
  getFarmerStorageUssd 
}
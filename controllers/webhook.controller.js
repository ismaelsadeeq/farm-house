//imports
const models = require('../models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const helpers = require('../utilities/helpers');
const smsGlobal = require('../utilities/sms.api');
const wooCommerce = require('../config/wooCommerce').WooCommerce;

require('dotenv').config();

//response
const responseData = {
	status: true,
	message: "Completed",
	data: null
}

const createWebhook = async (req,res)=>{
  const user = req.user;
  const isAdmin = await models.admin.findOne(
    {
      where:{
        id:user.id
      }
    }
  );
  if(isAdmin){
    const data = {
      name: "Order created",
      topic: "order.created",
      delivery_url: process.env.DELIVERY_URL
    };
    wooCommerce.post("webhooks", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    responseData.message = "completed";
    responseData.status = true;
    responseData.data = undefined;
    return res.json(responseData)
  } else{
    responseData.status = false;
    res.statusCode = 401
    return res.json("Unauthorize");
  }
}

const webhook = async (req,res)=> {
  const source = req.headers['x-wc-webhook-source']
  const topic = req.headers['x-wc-webhook-topic'];
  if(source == process.env.SOURCE){
    const data = req.body;
    if(topic === 'order.created' && data.status==='completed'){
      const products = data.line_items;
      for (let i = 0; i < products.length; i++) {
        let inventory = await models.inventory.findOne(
          {
            where:{
              wooCommerceProductId:products[i].product_id
            }
          }
        );
        const farmerId = inventory.farmerId;
        let noOfProducts = parseFloat(inventory.numberOfProduct) - parseFloat(products[i].quantity);
        let commulativePrice = noOfProducts * parseFloat(products[i].price);
        if(noOfProducts<= 0 ){
          await models.inventory.destroy(
            {
              where:{
                id:inventory.id
              }
            }
          );
          await models.productStorage.destroy(
            {
              where:{
                id:inventory.productStorageId
              }
            }
          );
          wooCommerce.delete(`products/${products[i].product_id}` , {
            force: true
          })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error.response);
            });
        } else {
          await models.inventory.update(
            {
              numberOfProduct:noOfProducts,
              cummulativeProductPrice:commulativePrice
            },
            {
              where:{
                id:inventory.id
              }
            }
          );
          await models.productStorage.update(
            {
              numberOfProduct:noOfProducts
            },
            {
              where:{
                id:inventory.productStorageId
              }
            }
          );
        }
        let purchasedProductPrice = parseFloat(products[i].quantity) * parseFloat(products[i].price);
        let time = new Date();
        time = time.toLocaleString()
        const createSoldProduct = await models.soldCommodity.create(
          {
            id:uuid.v4(),
            productName:products[i].name,
            numberOfProduct:products[i].quantity,
            productUnit:inventory.productUnit,
            pricePerUnit:products[i].price,
            cummulativeProductPrice:purchasedProductPrice,
            time:time,
            isDelivered:true
          }
        );
        const wallet = await models.farmerWallet.findOne(
          {
            where:{
              farmerId:farmerId
            }
          }
        );
        if(!wallet){
          const createWallet = await models.farmerWallet.create(
            {
              id:uuid.v4(),
              farmerId:farmerId,
              balance:purchasedProductPrice,
            }
          )
        }else{
          console.log(wallet.balance)
          await models.farmerWallet.update(
            {
              balance:parseFloat(wallet.balance) + parseFloat(purchasedProductPrice)
            },
            {
              where:{
              farmerId:farmerId
              }
            }
          )
        }
        await models.transaction.create(
          {
            id:uuid.v4(),
            farmerId:farmerId,
            transactionType:"credit",
            amount:purchasedProductPrice,
            status:true,
            time:time
          }
        );
      }
      responseData.status = 200;
      responseData.message = "completed";
      return res.json(responseData);
    }
    responseData.status = 200;
    responseData.message = "invalid payload";
    return res.json(responseData);
  }
  responseData.status = true;
  res.statusCode = 401;
  return res.send("Unauthorize");
}

module.exports = {
  createWebhook,
  webhook
}
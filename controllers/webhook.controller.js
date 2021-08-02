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

const webhook = async (req,res)=>
{
  const source = req.headers['X-WC-Webhook-Source']
  if(source == process.env.SOURCE){
    const topic = req.headers['X-WC-Webhook-Source'];
    if(topic == 'order.created'){
      
    }
  }
  responseData.status = false;
  res.statusCode = 401
  return res.json("Unauthorize");
}

module.exports = {
  createWebhook,
  webhook
}
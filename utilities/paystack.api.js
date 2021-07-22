const models = require('../models');
require('dotenv').config();
const uuid = require('uuid');
//New Implementation
const responseData = {
	status: true,
	message: "Completed",
	data: null
}

async function createCustomer(payload){
  const https = require('https')
  const params = JSON.stringify({
    "email": payload.email
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/customer',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data)
      const createWallet = await models.wallet.create(
        {
          id:uuid.v4(),
          userId:payload.id,
          virtualWalletId:response.data.id,
          customerCode:response.data.customer_code,
          accountBalance:"0.0"
        }
      );
      return "customer created"
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}
async function updateCustomer(customerCode,payload){
  const https = require('https')
  const params = JSON.stringify({
    "first_name": payload.firstName,
    "last_name":payload.lastName,
    "phone":payload.phoneNumber
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/customer/${customerCode}`,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data)
      console.log(response);
      if(response.status == true && response.message=="Customer updated"){
        return "Customer updated"
      }
      return "something went wrong"
    })
  }).on('error',async  error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}

async function validateCustomer(customerCode,payload){
  const https = require('https')
  const params = JSON.stringify({
    "country": "NG",
    "type": "bvn",
    "value": payload.bvnNumber,
    "first_name": payload.firstName,
    "last_name": payload.lastName
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/customer/${customerCode}/identification`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log(response)
      return response;
    })
  }).on('error', error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}
async function createNobaDedicatedAccount(customerCode,userId){
  const https = require('https')
  const params = JSON.stringify({
    "customer": customerCode, 
    "preferred_bank": "wema-bank"
  })
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/dedicated_account',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    }
  }
  const req = https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data);
      console.log(response);
      if(response.status === true && response.message === "NUBAN successfully created"){
        const updateWallet = await models.wallet.update(
          {
            bank:response.data.bank.name,
            accountNumber:response.data.account_number,
            accountName:response.data.account_name
          },
          {
            where:{
              userId:userId
            }
          }
        )
        return response
      }
      return "something went wrong"
    })
  }).on('error',async error => {
    console.error(error)
  })
  req.write(params)
  req.end()
}

async function deactivateAccount(id){
  const https = require('https')
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/dedicated_account/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer SECRET_KEY'
    }
  }
  https.request(options, res => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    });
    res.on('end',async () => {
      const response = JSON.parse(data);
      if(response.status === true && response.message === "Managed Account Successfully Unassigned"){
        const updateWallet = await models.wallet.update(
          {
            bank:null,
            accountNumber:null,
            accountName:null
          }
        )
        return "account deleted";
      }
      return "something went wrong"
    })
  }).on('error',async error => {
    console.error(error)
  })
}

module.exports = {
  //2nd implementation exports
  createCustomer,
  validateCustomer,
  updateCustomer,
  validateCustomer,
  createNobaDedicatedAccount,
  deactivateAccount
}
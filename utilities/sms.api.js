require('dotenv').config();
async function sendMessage(senderPhone,receiverPhone,text,id,deduction){
  let request = require('request');
  var options = {
		'method': 'POST',
		'url': `http://cheapglobalsms.com/api_v1?sub_account=${process.env.SUB_ACCOUNT}&sub_account_pass=${process.env.SUB_ACCOUNT_PASSWORD}&action=${"send_sms"}&sender_id=${senderPhone}&message=${text}&recipients=${receiverPhone}`,// before https://api.smsglobal.com/http-api.php?action=sendsms&user=${process.env.SMS_USER}&password=${process.env.SMS_PASSWORD}&from=${senderPhone}&to=${receiverPhone}&text=${text}`
		'headers': {
			'Content-Type': 'application/json'
    },
  }
  request(options,async function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
	})
}
module.exports ={
  sendMessage
}
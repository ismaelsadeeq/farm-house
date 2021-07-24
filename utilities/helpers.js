const crypto = require('crypto');
var CryptoJS = require("crypto-js");
require("dotenv").config();

const generateOTP =()=>{
  let value,val;
  value = Math.floor(100000 + Math.random() * 9000000);
  val = value.toString().substring(0, 5);
  return val
}
function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60 * 60 * 24);
}

const encrypt = (text) => {
  var ciphertext = CryptoJS.AES.encrypt(text,process.env.ENCRYPTION_KEY).toString();
  return ciphertext
};

const decrypt = (hash) => {
  var bytes  = CryptoJS.AES.decrypt(hash,process.env.ENCRYPTION_KEY);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText
};

module.exports ={
  generateOTP,
  getDifferenceInDays,
  encrypt,
  decrypt
}
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

module.exports = {

}
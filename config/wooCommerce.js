// Setup:
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
require('dotenv').config()
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM

const WooCommerce = new WooCommerceRestApi({
  url: 'http://localhost/wordpress/index.php', // Your store URL
  consumerKey: process.env.WORDPRESS_CONSUMER, // Your consumer key
  consumerSecret: process.env.WORDPRESS_CONSUMER_SECRET, // Your consumer secret
  version: 'wc/v3' // WooCommerce WP REST API version
});
module.exports = {
  WooCommerce
}
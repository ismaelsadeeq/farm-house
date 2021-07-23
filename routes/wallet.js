var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/wallet.controller');

router.post('/webhook',
  controller.nubanWebhook
);

router.get('/balance/api',
  controller.getBalanceWithToken
);
router.get('/balance',
  passport.authenticate('jwt',{session:false}),
  controller.getBalance
);
router.get('/account-details',
  passport.authenticate('jwt',{session:false}),
  controller.getAccountDetails
);
router.get('/account-details/api',
  controller.getAccountDetailsWithAPI
);
router.post('/buy/:commodityId',
  controller.buyACommodity
);
router.post('/commodities-api',
  controller.getPurchasedCommoditiesWithAPI
);
router.post('/commodities',
  passport.authenticate('jwt',{session:false}),
  controller.getPurchasedCommodities
);
router.post('/commodities-api/:soldCommodityId',
  controller.getPurchasedCommodityWithAPI
);
router.post('/commodities/:soldCommodityId',
passport.authenticate('jwt',{session:false}),
  controller.getPurchasedCommodity
);
module.exports = router;

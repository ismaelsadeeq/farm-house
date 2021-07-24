var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/inventory.controller');
router.get('/purchased',
  passport.authenticate('jwt',{session:false}),
  controller.getPurchasedCommodities
);
router.get('/purchased/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getPurchasedCommodity
);
router.put('/deliver/:id',
  passport.authenticate('jwt',{session:false}),
  controller.delivered
);
router.put('/un-deliver/:id',
  passport.authenticate('jwt',{session:false}),
  controller.unDelivered
);
router.get('/all',
  controller.getAllInventories
);
router.get('/:id',
  controller.getAnInventory
);

router.get('/',
  controller.searchForAnInventory
);


module.exports = router;

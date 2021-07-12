var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/storage.controller');

router.post('/store',
  passport.authenticate('jwt',{session:false}),
  controller.storeProduct
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getAStorage
);
router.get('/farmer/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getFarmerStorage
);
router.get('/warehouse/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getWarehouseStorage
);
router.get('all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllStorage
);
router.post('/widraw/:id',
  passport.authenticate('jwt',{session:false}),
  controller.widthraw
);


router.p

module.exports = router;

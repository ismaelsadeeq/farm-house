var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/processedCommodity.controller');

router.post('/centerId/:id/farmerId/:farmerId',
  passport.authenticate('jwt',{session:false}),
  controller.createProcess
);

router.put('/update-status/:id',
  passport.authenticate('jwt',{session:false}),
  controller.updateProcessStatus
);

router.delete('/widthraw-product/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteProduct
);

router.post('/store/commodity-processed/:id/warehouseId/:warehouseId',
  passport.authenticate('jwt',{session:false}),
  controller.storeProduct
);

router.get('/commodity/centerId/:centerId',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCommodity
);

router.get('/commodity/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getCommodity
);

module.exports = router;

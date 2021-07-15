var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/storage.controller');

router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllStorage
);

router.post('/widthraw/:id',
  passport.authenticate('jwt',{session:false}),
  controller.widthraw
);
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
//Not Tested
router.get('/farmer/:phoneNumber',
  controller.getFarmerStorageUssd
);
router.get('/warehouse/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getWarehouseStorage
);
router.get('/products-for-sale/warehouseId/:id',
  passport.authenticate('jwt',{session:true}),
  controller.getProductForSale
)

router.get('/products-not-for-sale/warehouseId/:id',
  passport.authenticate('jwt',{session:true}),
  controller.getProductNotForSale
)

router.post('/query-farmer/storageId/:storageId',
  passport.authenticate('jwt',{session:false}),
  controller.queryFarmer
);

//Not Tested
router.post('/for-sale-storage/:storageId',
  controller.changeStatusToForSale
)
router.post('/not-sale-storage/:storageId',
  controller.changeStatusToNotForSale
)

module.exports = router;

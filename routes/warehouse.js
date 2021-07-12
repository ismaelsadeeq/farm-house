var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/warehouse.controller');

router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.createWarehouse
);

router.put('/',
  passport.authenticate('jwt',{session:false}),
  controller.editWarehouse
);

router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getWarehouses
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getWarehouse
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteWarehouse
);


module.exports = router;

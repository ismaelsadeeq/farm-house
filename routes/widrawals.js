var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/widthrawals.controller');

router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getAWidthrawal
);

router.get('/farmer/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getAFarmerWidthrawal
);

module.exports = router;

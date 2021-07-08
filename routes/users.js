var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/user.controller');

router.get('/', 
  passport.authenticate('jwt',{session:false}),
  controller.getSHFAccount
);
router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.createSHFAccount
);
router.put('/',
  passport.authenticate('jwt',{session:false}),
  controller.updateSHFAccount
);
router.delete('/',
  passport.authenticate('jwt',{session:false}),
  controller.deleteSHFAccount
);

module.exports = router;

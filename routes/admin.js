var express = require('express');
var router = express.Router();
const controller = require('../controllers/admin.controller');
const passport = require('passport');

router.get('/', 
  passport.authenticate('jwt',{session:false}),
  controller.getAdmin
);

router.post('/login', 
  controller.adminLogin
);

router.post('/logout', 
  controller.logout
);


router.post('/', 
  controller.createAdmin
);

router.put('/', 
  passport.authenticate('jwt',{session:false}),
  controller.editAdmin
);

router.delete('/', 
  passport.authenticate('jwt',{session:false}),
  controller.deleteAdmin
);

module.exports = router;

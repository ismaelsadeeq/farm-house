var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/open.api.user.controller');

router.get('/keys', 
  passport.authenticate('jwt',{session:false}),
  controller.getKeys
);
router.get('/gennerate-keys', 
  passport.authenticate('jwt',{session:false}),
  controller.generateNewKeys
);
router.post('/add-bvn', 
  passport.authenticate('jwt',{session:false}),
  controller.addBvn
);
router.post('/delivery',
  passport.authenticate('jwt',{session:false}),
  controller.createDeliveryAddress
);
router.put('/delivery/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editDeliveryAddress
);
router.delete('/delivery/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteDeliveryAddress
);
router.get('/delivery',
  passport.authenticate('jwt',{session:false}),
  controller.getDeliveryAddresses
);
router.get('/delivery/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getDeliveryAddress
);
router.get('/', 
  passport.authenticate('jwt',{session:false}),
  controller.getUser
);

router.post('/login', 
  controller.login
);

router.post('/verify',
  controller.verifyEmail
)

router.post('/send-code',
  controller.sendCode
)
router.post('/reset-password',
  controller.resetPassword
)
router.post('/change-password', 
  passport.authenticate('jwt',{session:false}),
  controller.changePassword
);
router.post('/logout', 
  passport.authenticate('jwt',{session:false}),
  controller.logout
);

router.post('/', 
  controller.register
);

router.put('/', 
  passport.authenticate('jwt',{session:false}),
  controller.editUser
);

router.delete('/', 
  passport.authenticate('jwt',{session:false}),
  controller.deleteUser
);

module.exports = router;

var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/super.admin.controller');
router.get('/', 
  passport.authenticate('jwt',{session:false}),
  controller.getAdmin
);

router.post('/login', 
  controller.adminLogin
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
  controller.createAdmin
);

router.put('/edit', 
  passport.authenticate('jwt',{session:false}),
  controller.editAdmin
);

router.delete('/', 
  passport.authenticate('jwt',{session:false}),
  controller.deleteAdmin
);


module.exports = router;

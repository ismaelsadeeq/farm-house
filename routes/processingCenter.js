var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/processingCenter.controller')

router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.createCenter
);
router.pust('/',
  passport.authenticate('jwt',{session:false}),
  controller.editCenter
);
router.get('/',
  passport.authenticate('jwt',{session:false}),
  controller.getCenter
);
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCenter
);
router.delete('/',
  passport.authenticate('jwt',{session:false}),
  controller.deleteCenter
);
module.exports = router;

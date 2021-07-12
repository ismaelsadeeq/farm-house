var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/processingCenter.controller')

router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCenter
);
router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.createCenter
);
router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editCenter
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getCenter
);

router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteCenter
);
module.exports = router;

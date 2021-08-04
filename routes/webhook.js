var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/webhook.controller');

router.post('/',
  controller.webhook
);

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createWebhook
);


module.exports = router;

var express = require('express');
const passport = require('passport');
var router = express.Router();
const controller = require('../controllers/webhook.controller');

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createWebhook
);

router.post('/post',
  passport.authenticate('jwt',{session:false}),
  controller.webhook
);

module.exports = router;

var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/inventory.controller');

router.get('/all',
  controller.getAllInventories
);
router.get('/:id',
  controller.getAnInventory
);

router.get('/',
  controller.searchForAnInventory
);


module.exports = router;

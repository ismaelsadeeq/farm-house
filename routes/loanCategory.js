var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/loan.category.controller');

router.post('/',
  passport.authenticate('jwt',{session:false}),
  controller.addLoanCategory
);
router.put('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editLoanCategory
);
router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteLoanCategory
);
router.get('/all',
  controller.getLoanCategories
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getLoanCategory
);

module.exports = router;

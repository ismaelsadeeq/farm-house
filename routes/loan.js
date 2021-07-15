var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/loan.controller');

router.get('/approve/not-issued',
  passport.authenticate('jwt',{session:false}),
  controller.getApproveNotGivenLoans
);
router.get('/approve/issued',
  passport.authenticate('jwt',{session:false}),
  controller.getApproveGivenLoans
);
router.get('/approve/not-paid',
  passport.authenticate('jwt',{session:false}),
  controller.getApproveNotPaidLoans
);
router.get('/approve/paid',
  passport.authenticate('jwt',{session:false}),
  controller.getApprovePaidLoans
);
router.get('/un-approve',
  passport.authenticate('jwt',{session:false}),
  controller.unApprovedLoans
);
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getLoan
);
//ussd
router.post('/apply/:id',
  controller.applyLoanUssd
);

router.post('/apply-loan/farmerId/:id/categoryId/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.applyLoan
);
router.post('/approve',
  passport.authenticate('jwt',{session:false}),
  controller.approveLoan
);
router.post('/decline',
  passport.authenticate('jwt',{session:false}),
  controller.declineLoan
);
router.post('/issue',
  passport.authenticate('jwt',{session:false}),
  controller.issueLoan
);
router.post('/paid',
  passport.authenticate('jwt',{session:false}),
  controller.payLoan
);


module.exports = router;

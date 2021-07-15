var express = require('express');
var router = express.Router();
const passport = require('passport');
const controller = require('../controllers/loan.controller');

router.get('/approve/not-issued',
  passport.authenticate('jwt',{session:false}),
  controller.getApproveNotGivenLoans
);
router.get('/issued',
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
router.get('/applied',
  controller.unApprovedLoans
);
router.get('/:loanId',
  passport.authenticate('jwt',{session:false}),
  controller.getLoan
);
router.post('/apply/:loanCategoryId',
  controller.applyLoanUssd
);

router.post('/apply-loan/farmerId/:id/categoryId/:categoryId',
  passport.authenticate('jwt',{session:false}),
  controller.applyLoan
);
router.post('/approve/:loanId',
  passport.authenticate('jwt',{session:false}),
  controller.approveLoan
);
router.post('/decline/:loanId',
  passport.authenticate('jwt',{session:false}),
  controller.declineLoan
);
router.post('/issue/:loanId',
  passport.authenticate('jwt',{session:false}),
  controller.issueLoan
);
router.post('/paid/:loanId',
  passport.authenticate('jwt',{session:false}),
  controller.payLoan
);


module.exports = router;

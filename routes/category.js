var express = require('express');
var router = express.Router();
const controller = require('../controllers/category.controller');
const passport = require('passport');

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createCategory
)
router.put('/edit/:id',
  passport.authenticate('jwt',{session:false}),
  controller.editCategory
)

router.delete('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.deleteCategory
)
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCategories
)

router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getCategory
)





module.exports = router;

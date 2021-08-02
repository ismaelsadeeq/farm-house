var express = require('express');
var router = express.Router();
const controller = require('../controllers/category.controller');
const passport = require('passport');

router.post('/create',
  passport.authenticate('jwt',{session:false}),
  controller.createCategory
)
router.put('/edit',
  passport.authenticate('jwt',{session:false}),
  controller.editCategory
)

router.delete('/',
  passport.authenticate('jwt',{session:false}),
  controller.deleteCategory
)
router.get('/:id',
  passport.authenticate('jwt',{session:false}),
  controller.getCategory
)
router.get('/all',
  passport.authenticate('jwt',{session:false}),
  controller.getAllCategories
)





module.exports = router;

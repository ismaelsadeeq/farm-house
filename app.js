var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var cors = require('cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors())
app.options('*', cors()) // include before other routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
require('./config/passport')(passport);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var superAdminRouter = require('./routes/superAdmin');
var storageRouter = require('./routes/storage');
var warehouseRouter = require('./routes/warehouse');
var processingCenterRouter = require('./routes/processingCenter');
var widthrawalsRouter = require('./routes/widrawals')
var processedCommodityRouter = require('./routes/processedCommodity');
var inventoryRouter = require('./routes/inventory');
var loanRouter = require('./routes/loan');
var loanCategoryRouter = require('./routes/loanCategory');
var openApiUserRouter = require('./routes/open.api.users');
var walletRouter = require('./routes/wallet')

app.use('/api/v1', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/super-admin', superAdminRouter);
app.use('/api/v1/storage', storageRouter);
app.use('/api/v1/warehouse', warehouseRouter);
app.use('/api/v1/mini-processing-center', processingCenterRouter);
app.use('/api/v1/product-widthrawal', widthrawalsRouter);
app.use('/api/v1/process', processedCommodityRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/loan', loanRouter);
app.use('/api/v1/loan-category', loanCategoryRouter)
app.use('/api/v1/open-api/user', openApiUserRouter);
app.use('/api/v1/wallet', walletRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

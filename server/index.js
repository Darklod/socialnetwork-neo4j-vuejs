var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var morgan = require('morgan');
var cors = require('cors');
var compression = require('compression');
var passport = require('passport');

var app = express();

//Configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

//Security
app.disable('x-powered-by');

//Authorization
app.use(passport.initialize());
require('./config/passport')(passport);

//Routes
app.use('/', require('./routes/auth'));
app.use('/api/users', passport.authenticate('jwt', { session: false }), require('./routes/users'));
app.use('/api/follows', passport.authenticate('jwt', { session: false }), require('./routes/follows'));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

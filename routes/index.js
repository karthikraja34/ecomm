var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);
var passport = require('passport')
var Product = require('../models/product');


/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, docs) {

        res.render('index', { title: 'Express', products: docs });
    });

});
router.get('/signup',function(req,res){
  res.render('user/signup', {csrfToken: req.csrfToken() });
});
router.post('/signup',passport.authenticate('local.signup',{
  successRedirect : '/profile',
  failureRedirect : '/',
  failureFlash : true
}));
router.get('/profile',function(req,res,next){
 res.render('user/profile');
});

module.exports = router;
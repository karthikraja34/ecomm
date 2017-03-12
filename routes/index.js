var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);
var passport = require('passport')
var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, docs) {

        res.render('index', { title: 'Express', products: docs });
    });

});

// User routes
router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
router.post('/signup', passport.authenticate('local.signup', {

        failureRedirect: '/signup',
        failureFlash: true
    }),
    function(req, res, next) {
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect('oldUrl');
        } else {
            res.redirect('/profile');
        }
    });
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
router.post('/signin', passport.authenticate('local.signin', {

        failureRedirect: '/signin',
        failureFlash: true
    }),
    function(req, res, next) {
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect('oldUrl');
        } else {
            res.redirect('/profile');
        }
    }
);


router.get('/profile', isLoggedin, function(req, res, next) {
    res.render('user/profile');
});
router.get('/logout', isLoggedin, function(req, res, next) {
    req.logout();
    res.redirect('/');
})

//cart
router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/shoping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shoping-cart', { products: null });
    }
    var cart = new Cart(req.session.cart);

    res.render('shoping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
    console.log(cart.generateArray());
});

router.get('/checkout', function(req, res, next) {

    res.render('checkout');

});

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/signin');
}
module.exports = router;
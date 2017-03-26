var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);
var passport = require('passport');
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/orders');

/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function(err, docs) {

        res.render('index', { title: 'Express', products: docs, successmsg: successMsg, noMessage: !successMsg });
    });

});

router.get('/details/:val', function(req, res, next) {
    // var productId = req.params.val;
    // express.static.send(req, res, next, {
    //     root: __dirname + "/public",
    //     path: req.url,
    //     getOnly: true,
    //     callback: function(err) {
    //         console.log(err);
    //         var code = err.status || 404,
    //             msg = errMsgs["" + code] || "All is not right in the world";
    //         res.render("error", { code: code, msg: msg, layout:  false});
    // }
    // });
    Product.findById(req.params.val, function(err, product) {
        if (err) {
            return res.redirect('/');
        } else {
            res.render("details", { blog: product });
        }
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
    Order.find({ user: req.user }, function(err, orders) {
        if (err)
            return res.write("Error!!");
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
    });
    res.render('user/profile');
});
router.get('/logout', isLoggedin, function(req, res, next) {
    req.logout();
    res.redirect('/');
});

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
        console.log(req.session);
        res.redirect('back');

    });
});
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    console.log(cart);
    res.redirect('/shoping-cart');
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
    if (!req.session.cart) {
        res.redirect('/');
    }
    var cart = new Cart(req.session.cart);

    res.render('checkout', { total: cart.totalPrice, csrfToken: req.csrfToken() });

});
router.post('/checkout', function(req, res, next) {
    if (!req.session.cart) {
        res.redirect('/');
    }
    var cart = new Cart(req.session.cart);
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        phone: req.body.mobile,
        landmark: req.body.landmark,
        name: req.body.name,
        price: cart.totalPrice
    });
    order.save(function(err, result) {
        req.flash('success', 'Successfully bought product');
        console.log("Successfully bought");
        req.session.cart = null;
        res.redirect('/');
    });

});


function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/signin');
}
module.exports = router;
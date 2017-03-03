var Product = require('../models/product.js');
var mongoose = require('mongoose');


mongoose.connect('localhost:27017/ecomm');
var products = [
    new Product({
        imagePath: 'images/pic3.jpg',
        title: 'Pencil',
        decription: 'LOL',
        price: '300$',
        demoimg1: '',
        demoimg2: '',
        demoimg3: '',
        demoimg4: '',

    }), new Product({
        imagePath: 'images/pic2.jpg',
        title: 'Pen',
        decription: 'ROEFL',
        price: '350$',
        demoimg1: '',
        demoimg2: '',
        demoimg3: '',
        demoimg4: '',

    }),
    new Product({
        imagePath: 'images/pic4.jpg',
        title: 'Table',
        decription: 'A smart table',
        price: '100$',
        demoimg1: '',
        demoimg2: '',
        demoimg3: '',
        demoimg4: '',

    })
];

var done = 0;

for (i = 0; i < products.length; i++) {
    products[i].save(function(err, res) {
        done++;
        if (err) {
            console.log(err);
        }
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: { type: String, required: true },
    title: { type: String, required: true },
    decription: { type: String, required: true },
    featured: { type: Boolean },
    price: { type: Number, required: true },
    demoimg1: { type: String, required: false },
    demoimg2: { type: String, required: false },
    demoimg3: { type: String, required: false },
    demoimg4: { type: String, required: false }
});

module.exports = mongoose.model('Product', schema);
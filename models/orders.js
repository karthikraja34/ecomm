var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cart: { type: Object, required: true },
    landmark: { type: String, required: false },
    address: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Order', schema);
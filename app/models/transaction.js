var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var transactionSchema = new Schema({
    price: Number,
    date: Date,
    amount: Number,
    stock: String,
});

// the schema is useless so far
// we need to create a model using it
var Transaction = mongoose.model('Transaction', transactionSchema);

// make this available to our users in our Node applications
module.exports = Transaction;

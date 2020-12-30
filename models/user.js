const mongoose = require('mongoose')

var user_schema = new mongoose.Schema({
    username: String, 
    password_hash: String, 
    email: String
});

module.exports = mongoose.model('user', user_schema)
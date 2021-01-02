var mongoose = require('mongoose');

var user_schema = new mongoose.Schema({
    username:          String,
    nickname:          String,
    password_hash:     String,
    email:             String,
    affiliation:       String,
    permissions:       Number,
    registration_date: Date,
    last_login_date:   Date
}, 
{
    versionKey: false,
    collection: 'data'
});

module.exports = mongoose.model('users', user_schema);
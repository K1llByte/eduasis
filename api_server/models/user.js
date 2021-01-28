const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    username:          String,
    nickname:          String,
    password_hash:     String,
    email:             String,
    affiliation:       String,
    permissions:       Number,
    registration_date: Date,
    last_login_date:   Date,
    avatar_url:        String
}, 
{
    versionKey: false,
    collection: 'users'
});

module.exports = mongoose.model('users', user_schema);
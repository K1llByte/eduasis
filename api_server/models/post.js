const mongoose = require('mongoose');

const comment_schema = new mongoose.Schema({
    message:      String,
    created_date: Date,
    author:       String
});

const post_schema = new mongoose.Schema({
    content:     String,
    resource_id: String,
    comments:    [comment_schema]
},
{
    versionKey: false,
    collection: 'posts'
});

module.exports = mongoose.model('posts', post_schema);
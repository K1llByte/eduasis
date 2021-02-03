const mongoose = require('mongoose');

const request_schema = new mongoose.Schema({
    resource_id: String,
    type_id:     Number,
    author:      String,
    title:       String,
    description: String,
    filename:    String,
    create_date: Date,
    visibility:  Number // 0 public, 1 private
}, 
{
    versionKey: false,
    collection: 'requests'
});

module.exports = mongoose.model('requests', request_schema);
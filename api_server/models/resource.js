const mongoose = require('mongoose');

const rate_schema = new Schema({ 
    current_rate: String,
    num_rates:    String
});

const resource_schema = new mongoose.Schema({
    resource_id: String,
    type_id:     Number,
    title:       String,
    description: String,
    filename:    String,
    create_date: Date,
    visibility:  Number, // 0 public, 1 private
    rate :       rate_schema
}, 
{
    versionKey: false,
    collection: 'resources'
});

module.exports = mongoose.model('resources', resource_schema);
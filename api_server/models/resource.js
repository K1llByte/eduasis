const mongoose = require('mongoose');
const ResourceType = require('../controllers/resource_type');

const rates_schema = new mongoose.Schema({ 
    username: String,
    rated:    Number
},
{
    _id : false
});

const rate_schema = new mongoose.Schema({ 
    current_rate: Number,
    num_rates:    Number,
    rates:        [rates_schema]
},
{
    _id : false
});

const resource_schema = new mongoose.Schema({
    resource_id: String,
    type_id:     Number,
    author:      String,
    title:       String,
    description: String,
    filename:    String,
    created_date: Date,
    visibility:  Number, // 0 public, 1 private
    rate :       rate_schema
}, 
{
    versionKey: false,
    collection: 'resources'
});

module.exports = mongoose.model('resources', resource_schema);
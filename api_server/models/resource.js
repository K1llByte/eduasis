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
    create_date: Date,
    visibility:  Number, // 0 public, 1 private
    rate :       rate_schema
}, 
{
    versionKey: false,
    collection: 'resources'
});

module.exports = mongoose.model('resources', resource_schema);

/* 

{
    "resource_id" : "1",
    "type_id"     : 1,
    "author"      : "test",
    "title"       : "Test Resource",
    "description" : "This is a test resource to provide funcionality to development branch of Eduasis",
    "filename"    : "test.txt",
    "create_date" : "1",
    "visibility"  : 0,
    "rate" : {
        "current_rate" : 0,
        "num_rates"    : 0
    }
}

*/

// ((current_rate * num_rates) + new_rate) / ( num_rates + 1 )
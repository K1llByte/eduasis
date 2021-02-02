const mongoose = require('mongoose');

const resource_type_schema = new mongoose.Schema({
    type_id:     Number,
    name:        String
}, 
{
    versionKey: false,
    collection: 'resource_types'
});

module.exports = mongoose.model('resource_types', resource_type_schema);
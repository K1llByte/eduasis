const mongoose = require('mongoose');
const Request = require('../models/request');

// ===== CRUD Operations ===== //

module.exports.list_all = (page_num,page_limit) => {
    
    return Request
        .find()
        .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
        .limit(page_limit)
        .exec()
}

module.exports.get = (rid) => {
    return Request
        .findOne({resource_id:rid})
        .exec();
}

module.exports.insert = (request_data) => {
    request_data.resource_id = mongoose.Types.ObjectId().toString('base64');
    let new_request = new Request(request_data);
    return new_request.save()
}

// =========================== //
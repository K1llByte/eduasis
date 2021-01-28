const Resource = require('../models/resource');
const mongoose = require('mongoose');

const RESOURCE_PROJECTION = {
    "_id"         :0,
    "resource_id" :1,
    "type"   : { $arrayElemAt: [ "$type.name" , 0 ] },
    "author"      :1,
    "title"       :1,
    "description" :1,
    "filename"    :1,
    "create_date" :1,
    "visibility"  :1,
    "rate" : "$rate.current_rate"
};

// ===== CRUD Operations ===== //

module.exports.list_all = () => {
    return Resource
        .aggregate([
            {
              "$lookup":
                {
                  "from": "resource_types",
                  "localField": "type_id",
                  "foreignField": "type_id",
                  "as": "type"
                }
           },
           {
                "$project" : RESOURCE_PROJECTION
           }
        ])
        .exec()
}


module.exports.get = (rid) => {
    return Resource
        .find({ "resource_id": rid }, RESOURCE_PROJECTION)
        .exec()
}

// Inserts a new user
module.exports.insert = (resource_data) => {
    resource_data.resource_id = mongoose.Types.ObjectId().toString('base64');
    let new_resource = new Resource(resource_data);
    return new_resource.save()
}

// =========================== //

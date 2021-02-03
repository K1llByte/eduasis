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

module.exports.list_all = (page_num,page_limit,search_term=null,type_id=null) => {
    let match = { "$match" : { "visibility" : 0 } };
    if(search_term != null)
    {
        match['$match'].title = { "$regex": search_term, "$options": 'i' };
    }

    if(type_id != null)
    {
        match['$match'].type_id = type_id;
    }
    
    return Resource
        .aggregate([
            match,
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
        .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
        .limit(page_limit)
        .exec()
}

// Get a resource
module.exports.get = (rid) => {
    return Resource
        .findOne({ "resource_id": rid }, RESOURCE_PROJECTION)
        .exec()
}

// Inserts a new resource
module.exports.insert = (resource_data) => {
    resource_data.resource_id = mongoose.Types.ObjectId().toString('base64');
    let new_resource = new Resource(resource_data);
    return new_resource.save()
}

// =========================== //

module.exports.rate = async (rid,username,value) => {
    
    let res = await Resource.findOne(
        {resource_id:rid},
        {_id:0,current_rate:1,num_rates:1,rates:1}
    ).exec()
    console.log(res);
    res.current_rate = (res.current_rate * res.num_rates + value) / (num_rates + 1);
    res.num_rates = res.num_rates + 1;
    res.rates.push({
        "username": username,
        "rated": value
    });

    return db.resources.updateOne(
            {"resource_id":rid},
            {$set : res
        }).exec();
}
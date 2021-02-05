const mongoose = require('mongoose');
const Resource = require('../models/resource');

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

module.exports.list_all = (options) => { // page_num=null,page_limit=null,search_term=null,type_id=null
    let page_num = options.page_num;
    let page_limit = options.page_limit;
    let author = options.author;
    let search_term = options.search_term;
    let type_id = options.type_id;

    let match = { "$match" : { "visibility" : 0 } };
    if(search_term != null)
    {
        match['$match'].title = { "$regex": search_term, "$options": 'i' };
    }

    if(type_id != null)
    {
        match['$match'].type_id = type_id;
    }

    if(author != null)
    {
        match['$match'].author = author;
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

module.exports.gen_id = () => {
    return mongoose.Types.ObjectId().toString('base64');
}

module.exports.rate = async (rid,username,value) => {
    
    var res = await Resource.findOne(
        {resource_id:rid},
        {_id:0,"rate.current_rate":1,"rate.num_rates":1,"rate.rates":1}
    ).exec();

    res.rate.rates.forEach(r => {
        if(r.username === username)
            throw Error('User already rated this resource');
    });

    res.rate.current_rate = (res.rate.current_rate * res.rate.num_rates + value) / (res.rate.num_rates + 1);

    res.rate.num_rates = res.rate.num_rates + 1;
    res.rate.rates.push({
        "username": username,
        "rated": value
    });

    Resource.updateOne(
            {"resource_id":rid},
            {$set : res
        }).exec();
    
    return res.rate.current_rate;
}


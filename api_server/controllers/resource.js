const mongoose = require('mongoose');
const Resource = require('../models/resource');

const RESOURCE_PROJECTION = {
    "_id"          :0,
    "resource_id"  :1,
    "type"   : { $arrayElemAt: [ "$type.name" , 0 ] },
    "author"       :1,
    "title"        :1,
    "description"  :1,
    "filename"     :1,
    "created_date" :1,
    "visibility"   :1,
    "rate" : "$rate.current_rate"
};

// ===== CRUD Operations ===== //

module.exports.list_all = (options) => {
    let page_num = options.page_num;
    let page_limit = options.page_limit;
    let author = options.author;
    let search_term = options.search_term;
    let type_id = options.type_id;
    let sorted = options.sorted;

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

    let query = Resource
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
        ]);


    if(sorted != null)
    {
        return query.sort({created_date: 1})
            .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
            .limit(page_limit)
            .exec();
    }
    else
    {
        return query
            .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
            .limit(page_limit)
            .exec();
    }
    
}

// Get a resource
module.exports.get = (rid) => {
    return Resource
        .aggregate([
            {
                "$match" : { "resource_id": rid }
            },
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

// Inserts a new resource
module.exports.insert = (resource_data) => {
    resource_data._id = mongoose.Types.ObjectId(resource_data.resource_id);
    let new_resource = new Resource(resource_data);
    return new_resource.save()
}


// Deletes resource by id
module.exports.delete = (rid) => {
    return Resource
        .deleteOne({ "resource_id":rid })
        .exec();
}

// =========================== //

module.exports.gen_id = () => {
    return mongoose.Types.ObjectId().toString('hex');
}


module.exports.get_rate = async (rid,username) => {

    var rate = await Resource.findOne(
        {
            "resource_id": rid
        },
        {
            "_id":0,
            "current_rate":"$rate.current_rate",
            "num_rates":"$rate.num_rates",
            "rates":"$rate.rates"
        }
    )
    // .lean() is an alternative to .toObject()
    // since query object aren't javascript pure objects
    .lean() 
    .exec();

    rate.you_rated = null;
    rate.rates.forEach(e => {
        if(e.username === username)
            rate.you_rated = e.rated;
    });
    delete rate.rates;
    return rate;
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
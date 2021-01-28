const Resource = require('../models/resource');

// ===== CRUD Operations ===== //

// =========================== //

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
                "$project" : 
                {
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
                }
           }
        ])
        .exec()
}

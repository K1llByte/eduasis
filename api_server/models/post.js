const mongoose = require('mongoose');

const comment_schema = new mongoose.Schema({
    message:      String,
    created_date: Date,
    author:       String
});

const post_schema = new mongoose.Schema({
    post_id:      String,
    resource_id:  String,
    content:      String,
    author:       String,
    created_date: Date,
    comments:     [comment_schema]
},
{
    versionKey: false,
    collection: 'posts'
});

module.exports = mongoose.model('posts', post_schema);


// db.resources.aggregate([
//    {
//      "$lookup":
//        {
//          "from": "resource_types",
//          "localField": "type_id",
//          "foreignField": "type_id",
//          "as": "type"
//        }
//   },
//   {
//     "$project" : {
//         "_id"         : 0
//         "resource_id" :1,
//         "type"   : { $arrayElemAt: [ "$type.name" , 0 ] },
//         "title"       :1,
//         "description" :1,
//         "filename"    :1,
//         "create_date" :1,
//         "visibility"  :1,
//         "rate" : "$rate.current_rate"
//     }
//   }
// ])
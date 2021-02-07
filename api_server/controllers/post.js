const Post = require('../models/post');
const mongoose = require('mongoose');

// ===== CRUD Operations ===== //

module.exports.list_all = (options) => {
    let page_num = options.page_num;
    let page_limit = options.page_limit;
    let author = options.author;
    let resource_id = options.resource_id;
    let sorted = options.sorted;
    
    let match = { };
    if(author != null)
    {
        match.author = author;
    }

    if(resource_id != null)
    {
        match.resource_id = resource_id;
    }

    let query = Post
        .find(match,{_id:0,"comments._id":0});


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

// Get a post by post_id
module.exports.get = (pid) => {
    return Post
        .findOne({post_id:pid},{_id:0,"comments._id":0})
        .exec();
}

// Inserts a new post
module.exports.insert = (post_data) => {
    post_data.post_id = mongoose.Types.ObjectId().toString('hex');
    post_data._id = mongoose.Types.ObjectId(post_data.post_id);
    let new_post = new Post(post_data);
    return new_post.save();
}

// Deletes post by id
module.exports.delete = (pid) => {
    return Post
        .deleteOne({ "post_id":pid })
        .exec();
}

// =========================== //

module.exports.insert_comment = (post_id, comment_data) => {
    return Post.updateOne(
            { post_id: post_id },
            { $push: {"comments": comment_data} }
        )
        .exec()
}
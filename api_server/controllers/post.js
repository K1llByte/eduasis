const Post = require('../models/post');
const mongoose = require('mongoose');

// ===== CRUD Operations ===== //

module.exports.list_all = (page_num,page_limit) => {
    
    return Post
        .find()
        .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
        .limit(page_limit)
        .exec()
}

module.exports.get = (pid) => {
    return Post
        .findOne({post_id:pid})
        .exec();
}

// Inserts a new post
module.exports.insert = (post_data) => {
    post_data.post_id = mongoose.Types.ObjectId().toString('base64');
    let new_post = new Post(post_data);
    return new_post.save();
}


module.exports.insert_comment = (post_id, comment_data) => {
    return Post.updateOne(
            { post_id: post_id },
            { $push: {"comments": comment_data} }
        )
        .exec()
}

// =========================== //
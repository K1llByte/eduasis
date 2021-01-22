const User = require('../models/user');

// ===== CRUD Operations ===== //

// Returns all users list
module.exports.list_all = () => {
    return User
        .find({},{ _id:0, password_hash:0})
        //.sort({ username : 1 })
        .exec();
}

// Returns a user by username
module.exports.get = (uname) => {
    return User
        .findOne({ username: uname })
        .exec();
}

// Updated user data
module.exports.set = (userdata) => {
    return User
        .updateOne({username:userdata['username']},{$set : data})
        .exec();
}

// Adds a new user data
module.exports.add = (userdata) => {
    const new_user = new User(userdata)
    return new_user.save();
}

// Deletes user by username
module.exports.delete = (uname) => {
    return User
        .deleteOne({ username: uname })
        .exec();
}

// =========================== //
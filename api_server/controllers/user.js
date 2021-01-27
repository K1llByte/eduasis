const User = require('../models/user');
const crypto = require('crypto');

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

// Inserts a new user
module.exports.insert = (userdata) => {
    var new_user = new User(userdata);
    new_user.save()
    return ;
}

// =========================== //

module.exports.parse_password_hash = (password) => {
    const arr = password.split(':');
    return {
        "hash_algorithm" : arr[0],
        "salt"           : arr[1],
        "password_hash"  : arr[2]
    };
}

module.exports.gen_password_hash = async (password) => {
    const SALT_SIZE = 9;
    const salt_bytes = (await crypto.randomBytes(SALT_SIZE)).toString('base64');
    const passwd_hash = crypto.createHash('sha256')
        .update(salt_bytes + password)
        .digest('base64');
    
    return `sha256:${salt_bytes}:${passwd_hash}`;
}

module.exports.verify_password = async (username,in_password) => {

    var userdata = await this.get(username)

    if(userdata != null)
    {
        const passwd_obj = this.parse_password_hash(userdata.password_hash);
                
        const in_pass_hash = crypto.createHash(passwd_obj.hash_algorithm)
            .update(passwd_obj.salt + in_password)
            .digest('base64');
    
        return (passwd_obj.password_hash === in_pass_hash) ? 
            userdata : 
            null;
    }
    else
    {
        return null;
    }
    
}


// =========================== //
  
// Permissions Enum
module.exports.Permissions = Object.freeze({
    "Guest" :       0b00000000,
    //"RegularUser" : 0b00000001,
    "Consumer" :    0b00000001,
    "Producer" :    0b00000010,
    "Admin" :       0b10000000
});
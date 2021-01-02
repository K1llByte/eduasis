// Student controller

const User = require('../models/user');

// TODO OPERATIONS:
// list_all()
// add(user_data)
// get(username)
// set(user_data)
// delete(user_data)

// Returns student list
module.exports.list_all = () => {
    return User
        .find()
        //.sort({ username : 1 })
        .exec();
}

module.exports.get = uname => {
    return User
        .findOne({ username: uname })
        .exec();
}

module.exports.set = uname => {
    return User
        .findOne({ username: uname })
        .exec();
}

module.exports.delete = uname => {
    return User
        .deleteOne({ username: uname })
        .exec();
}
// module.exports.insert = student => {
//     var new_user = new User(student)
//     return newStudent.save()
// }
// Student controller

const User = require('../models/user');

// Returns student list
module.exports.list = () => {
    return User
        .find()
        .sort({ username : 1 })
        .exec()
}

// module.exports.lookUp = id => {
//     return User
//         .findOne({numero: id})
//         .exec()
// }

// module.exports.insert = student => {
//     var new_user = new User(student)
//     return newStudent.save()
// }
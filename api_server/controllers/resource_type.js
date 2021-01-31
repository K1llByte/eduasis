const ResourceType = require('../models/resource_type');

// ===== CRUD Operations ===== //

// =========================== //

module.exports.list_all = () => {
    return ResourceType
        .find({},{_id:0})
        .exec()
}

module.exports.get = (tid) => {
    return ResourceType
        .findOne({type_id:tid},{_id:0,type_id:0})
        .exec()
}
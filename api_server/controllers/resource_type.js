const ResourceType = require('../models/resource_type');

// ===== CRUD Operations ===== //

// =========================== //

module.exports.list_all = () => {
    return ResourceType
        .find()
        .exec()
}

module.exports.get = (tid) => {
    return ResourceType
        .findOne({type_id:tid})
        .exec()
}
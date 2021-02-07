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

module.exports.insert = (rt_data) => {
    var new_rt = new ResourceType(rt_data);
    return new_rt.save()
}


// Deletes resource_type by id
module.exports.delete = (tid) => {
    return ResourceType
        .deleteOne({ "type_id":tid })
        .exec();
}



module.exports.next_id = async () => {
    let v = await ResourceType
        .find({},{_id:0,name:0})
        .sort({type_id:-1})
        .limit(1).exec();
    
    return v[0].type_id + 1;
}
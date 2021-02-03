const express = require('express');
const auth = require('../controllers/auth');
const User = require('../controllers/user');
const Resource = require('../controllers/resource');
const ResourceType = require('../controllers/resource_type');
const multer = require('multer');
const AdmZip = require('adm-zip');

// ================================== //

const router = express.Router();

// ========= RESOURCE STORAGE ========= //

const resource_storage = multer.diskStorage({
    destination : (req, file, next) => {
        next(null,'storage/resources/');
    },
    filename : (req, file, next) => {
        const tmp = file.originalname.split('.');
        const ext = tmp[tmp.length-1];
        req.resource_id = Resource.gen_id();
        next(null,`${req.resource_id}.${ext}`);
    }
});


const data_process_filter = async (req) => {
    const type_id = req.body.type_id;
    const title = req.body.title;
    const description = req.body.description;
    const visibility = req.body.visibility;

    try {
        let type = await ResourceType.get(type_id);
        if(type == null) 
        {
            req.error = 'Invalid type_id';
            return;
        }
    }
    catch { // TODO: Not sure about this, check later
        req.error = 'Invalid type_id';
        return;
    }
    
    if(title == undefined)
    {
        req.error = 'Invalid title';
        return;
    }

    if(description == undefined)
    {
        req.error = 'Invalid description';
        return;
    }

    if(visibility == undefined || (visibility != 1 && visibility != 0 ) )
    {
        req.error = 'Invalid visibility';
        return;
    }

    req.resource_id = Resource.gen_id();
    const new_resource = {
        "type_id" : type_id,
        "author" : req.user.username,
        "title" : title,
        "description" : description,
        "filename" : `${req.resource_id}.zip`,
        "create_date" : Date.now(),
        "visibility" : visibility,
        "rate" : { "current_rate":0, "num_rates":0, "rates":[] },
    };
        
    try {
        await Resource.insert(new_resource);
    }
    catch(err) {
        req.error = err.message;
    }
};

const file_type_filter = async (req,file,next) => {

    req.valid = (file.mimetype === 'application/zip');
    if(req.valid)
    {
        await data_process_filter(req)
        req.valid = req.valid && (req.error == undefined)
    }
    else
    {
        req.error = 'Invalid file type (zip with BagIt format)!';
    }

    next(null,req.valid);
};

const resource_upload = multer({ 
    storage: resource_storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter: file_type_filter
});

// ========= USER ENDPOINTS ========= //

router.get('/api/resources', auth.authenticate(User.CPermissions.apc), (req, res) => {

    let search_term = null;
    let type_id = null;
    if(req.query.search != undefined)
    {
        // Escape all regex operators
        search_term = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    if(req.query.type_id != undefined)
    {
        type_id = Number(req.query.type_id);
        if(isNaN(type_id))
        {
            res.status(400).json({'error': 'type_id is not a number'});
            return;
        }
    }

    let page_num = 0;
    let page_limit = 20;

    if(req.query.page_num != undefined)
    {
        page_num = Number(req.query.page_num);
        if(isNaN(page_num))
            res.status(400).json({'error': "Invalid page_num param"});
    }

    if(req.query.page_limit != undefined)
    {
        page_limit = Number(req.query.page_limit);
        if(isNaN(page_limit)) // || page_limit > 100
            res.status(400).json({'error': "Invalid page_limit param"});
    }

    Resource.list_all(page_num,page_limit,search_term,type_id)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json({'error': err});
        });
});


router.get('/api/resources/:resource_id', auth.authenticate(User.CPermissions.apc), (req, res) => {

    Resource.get(req.params.resource_id)
        .then(data => {
            if(data.visibility === 0)
            {
                res.json(data);
            }
            else
            {
                res.status(404).json({"error" : "Not Found"})
            }
        })
        .catch(err => { 
            res.json('error', err.message);
        });
});


router.post('/api/resources', auth.authenticate(User.CPermissions.ap), resource_upload.single('resource_data'), (req, res) => {

    if(req.valid)
    {
        res.json({"success":"Resource created successfully"});
    }
    else 
    {
        res.status(400).json({"error":req.error});
    }
    

    // const type_id = req.body.type_id
    // const title = req.body.title
    // const description = req.body.description
    // const visibility = req.body.visibility

    // ResourceType.get(type_id)
    // .then(data => {
    //     if(title == undefined)
    //     {
    //         res.status(400).json('error', "Invalid title");
    //         return;
    //     }
    //     if(description == undefined)
    //     {
    //         res.status(400).json('error', "Invalid description");
    //         return;
    //     }
    //     if(visibility == undefined || (visibility != 1 && visibility != 0 ) )
    //     {
    //         res.status(400).json('error', "Invalid visibility");
    //         return;
    //     }
    //     const new_resource = {
    //         "type_id" : type_id,
    //         "author" : req.user.username,
    //         "title" : title,
    //         "description" : description,
    //         "filename" : "file.txt",
    //         "create_date" : Date.now(),
    //         "visibility" : visibility,
    //         "rate" : { "current_rate":0, "num_rates":0 },
    //     };
        
    //     Resource.insert(new_resource)
    //         .then(data => { 
    //             res.json({ "success": "Resource created successfully" });
    //         })
    //         .catch(err => { 
    //             res.status(400).json({'error': err.message});
    //         });
    // })
    // .catch(err => {
    //     res.status(400).json('error', "Invalid type_id");
    // })
});


router.put('/api/resources/:resource_id/rate', auth.authenticate(User.CPermissions.apc), (req, res) => {

    let value = Number(req.body.value);
    if(req.body.value == undefined || !(value >= 0 && value <= 5 && Number.isInteger(value)))
    {
        res.status(400).json({'error': 'Invalid value'});
        return;
    }

    Resource.rate(req.params.resource_id, req.user.username, value)
        .then(data => {
            res.json({
                "new_rate": data
            });
        })
        .catch(err => { 
            res.status(400).json({'error': err.message});
        });
});


router.get('/api/resource_types', auth.authenticate(User.CPermissions.apc), (req, res) => {

    ResourceType.list_all()
        .then(data => {
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


router.get('/api/resource_types/:type_id', auth.authenticate(User.CPermissions.apc), (req, res) => {

    ResourceType.get(req.params.type_id)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


module.exports = router;
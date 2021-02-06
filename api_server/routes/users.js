const express = require('express');
const auth = require('../controllers/auth');
const User = require('../controllers/user');
const multer = require('multer');

// ================================== //

const router = express.Router();

// ========= AVATAR STORAGE ========= //

const avatar_storage = multer.diskStorage({
    destination : (req, file, next) => {
        next(null,'storage/avatars/');
    },
    filename : (req, file, next) => {
        const tmp = file.originalname.split('.')
        const ext = tmp[tmp.length-1];
        req.new_filename = `${req.user.username}.${ext}`
        next(null,req.new_filename);
    }
});

const img_type_filter = (req,file,next) => {
    
    req.valid_img_type = (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png');
    req.valid = (req.params.username === req.user.username) && 
        req.valid_img_type;

    // if(req.valid)
    //     next(null,true);
    // else
    //     next(null,false);
    next(null,req.valid);
};

const avatar_upload = multer({ 
    storage: avatar_storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter: img_type_filter
});

// ========= USER ENDPOINTS ========= //

router.get('/api/users', auth.authenticate(User.CPermissions.apc), (req, res) => {
    
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

    User.list_all(page_num,page_limit,true)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.status(400).json({'error': err});
        });
});


router.get('/api/users/@me', auth.authenticate(User.CPermissions.apc), (req, res) => {

    User.get(req.user.username,true)
    .then(data => { 
        if(data != null)
        {
            res.json(data);
        }
        else // Probably impossible, unless the user is deleted
        {
            res.status(404).json({"error":"User not found"});
        }
    })
    .catch(err => { 
        res.json('error', err);
    });
});


router.get('/api/users/:username', auth.authenticate(User.CPermissions.apc), (req, res) => {

    User.get(req.params.username,true)
    .then(data => { 
        if(data != null)
        {
            res.json(data);
        }
        else
        {
            res.status(404).json({"error":"User not found"});
        }
    })
    .catch(err => { 
        res.json('error', err);
    });
});


router.put('/api/users/:username', auth.authenticate(User.CPermissions.apc), (req, res) => {

    if(req.params.username == req.user.username)
    {
        const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const NICKNAME_REGEX = /^.{1,32}$/;
        const nickname = req.body.nickname;
        const email = req.body.email;
        const affiliation = req.body.affiliation;
        let updated_fields = { "username": req.user.username };

        // INPUT VALIDATION
        if(nickname != undefined)
        {
            if(nickname.match(NICKNAME_REGEX))
            {
                updated_fields.nickname = nickname;
            }
            else
            {
                res.status(400).json({"error": "Invalid nickname"});
                return;
            }
        }
        // INPUT VALIDATION
        if(email != undefined)
        {
            if(email.match(EMAIL_REGEX))
            {
                updated_fields.email = email;
            }
            else
            {
                res.status(400).json({"error": "Invalid email"});
                return;
            }
        }
        // INPUT VALIDATION
        if(affiliation != undefined)
        {
            updated_fields.affiliation = affiliation;
        }
        
        User.set(updated_fields)
            .then(() => {
                res.json({"success": "Updated successfully" });
            })
            .catch(err => {
                res.status(500).json({"error": "Something unexpected occured"});
            });
    }
    else
    {
        res.status(401).json({"error":"Forbidden!"});
    }
});


router.get('/api/users/:username/avatar', (req, res) => {
    
    User.get(req.params.username)
    .then(data => {
        if(data != null)
        {
            if(data.avatar_url != '')
                res.redirect(data.avatar_url);
            else
                res.redirect('/storage/avatars/default/default.png');
        }
        else
            res.status(404).json({"error":'User not found'});
        
        
    })
    .catch(err => {
        res.status(500).json({"error":err});
    });
    
});


router.put('/api/users/:username/avatar', auth.authenticate(User.CPermissions.apc), avatar_upload.single('avatar_img'), (req, res) => {

    if(req.valid)
    {
        User.set({ 
            "username":req.params.username,
            "avatar_url":`http://localhost:7700/storage/avatars/${req.new_filename}`})
            .then(data => {
                res.json({"success":"Avatar changed successfully"});
            })
            .catch(err => {
                res.status(500).json({"error":err.message});
            });
        
    }
    else if(req.valid_img_type)
    {
        res.status(401).json({"error":"Forbidden!"});
    }
    else
    {
        res.status(422).json({"error":"Invalid image type (jpeg or png)!"});
    }
});


router.delete('/api/users/:username', auth.authenticate(User.Permissions.Admin), (req, res) => {

    User.delete(req.params.username)
    .then(data => {
        console.log(data);
        if(data.deletedCount != 0)
            res.json({"success":"User deleted successfully"});
        else 
            res.status(400).json({"error":"User doesn't exist"});
    })
    .catch(err => {
        res.status(400).json({"error":err.message});
    });
});

module.exports = router;
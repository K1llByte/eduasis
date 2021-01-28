const express = require('express');
const User = require('../controllers/user');
const Resource = require('../controllers/resource');
const auth = require('../controllers/auth');
const { Blacklist } = require('../controllers/blacklist');
const multer = require('multer');

// ========================= //

const storage = multer.diskStorage({
    destination : (req, file, next) => {
        next(null,'storage/avatars/');
    },
    filename : (req, file, next) => {
        const tmp = file.originalname.split('.')
        const ext = tmp[tmp.length-1];
        next(null,`${req.user.username}.${ext}`);
    }
});

const img_type_filter = (req,file,next) => {
    
    req.valid_img_type = (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png');
    req.valid = (req.params.username == req.user.username) && 
        req.valid_img_type;

    if(req.valid)
        next(null,true);
    else
        next(null,false);
};

const upload = multer({ 
    storage: storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter: img_type_filter
});

//const passport = require('passport');

const router = express.Router();
var blacklist = new Blacklist();

// ========= ROUTES ========= //


router.post('/api/login', (req, res) => {

    User.verify_password(req.body.username,req.body.password)
        .then(userdata => {
            if(userdata != null)
            {
                const token = auth.gen_token(userdata);
                res.json({ "TOKEN":token });
            }
            else
            {
                res.status(401).json({ "error":"Incorrect credentials" });
            }
        });
});

router.post('/api/logout', (req, res) => {

    const token = auth.fetch_token(req);
    if(token == null)
    {
        res.status(401).json({ "error" : "Not logged in" });
    }
    else if(blacklist.has(token))
    {
        res.status(401).json({ "error" : "Token already revoked" });
    }
    else
    {
        blacklist.add(token);
        blacklist.clear();
        res.json({ "success" : "Succsessfully revoked token" });
    }
});


// router.post('/api/login', (req,res) => {
//     res.json(req.body);
// })


router.post('/api/register', (req,res) => {
    
    const USERNAME_REGEX = /^(\w|-){1,32}$/;
    const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const WEAK_PASSWD_REGEX = /^(\w|-|\.){8,32}$/
    const STRONG_PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/

    // INPUT VALIDATION
    if(req.body.username.match(USERNAME_REGEX) &&
        req.body.email.match(EMAIL_REGEX)      &&
        req.body.password.match(WEAK_PASSWD_REGEX))
    {
        // Check if username exists
        User.get(req.body.username)
        .then(data => {
            if(data == null)
            {
                User.gen_password_hash(req.body.password)
                .then(password_hash => {
                    const date_now = Date.now();
                    User.insert({
                        "username"          : req.body.username,
                        "nickname"          : "",
                        "password_hash"     : password_hash, 
                        "email"             : req.body.email,
                        "affiliation"       : "",
                        "permissions"       : User.Permissions.Consumer,
                        "registration_date" : date_now,
                        "last_login_date"   :   date_now
                    })
                    
                    res.json({ "status" : "success" });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ "status" : err });
                })
            }
            else
            {
                res.json({ "status" : "User already exists" });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({ "status" : err });
        })
        
    }
    else
    {
        res.json({ "status" : "error" });
    }
})

// ========= DATA ENDPOINTS ========= //

router.get('/api/users', auth.authenticate(User.Permissions.Consumer), (req, res) => {
    
    User.list_all()
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


router.get('/api/users/:username', auth.authenticate(User.Permissions.Consumer), (req, res) => {

    User.get(req.params.username)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


router.post('/api/users/:username/avatar', auth.authenticate(User.Permissions.Consumer), upload.single('avatar_img'), (req, res) => {

    if(req.valid)
    {
        res.json({"success":"Avatar changed successfully"});
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


router.get('/api/test', auth.authenticate(User.Permissions.Consumer), (req, res) => {
    
    Resource.list_all()
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


router.post('/api/post', auth.authenticate(User.Permissions.Consumer), (req, res) => {
    

    Resource.list_all()
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});

module.exports = router;
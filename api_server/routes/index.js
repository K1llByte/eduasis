const express = require('express');
const User = require('../controllers/user');
const auth = require('../controllers/auth');
//const passport = require('passport');

const router = express.Router();

// ========= ROUTES ========= //


router.get('/api/check_passwd/:password', (req, res) => {

    var asd = User.verify_password('user1',req.params.password)
        .then(data => {
            res.json({ "then":data });
        })
        .catch(err => {
            res.json({ "catch":false });
        })
   
});


router.post('/api/login', (req,res) => {
    res.json(req.body);
})


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


router.get('/api/users', (req, res) => {
    
    User.list_all()
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


router.get('/api/users/:username', auth.authenticate(User.Permissions.Guest), (req, res) => {

    User.get(req.params.username)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});

module.exports = router;

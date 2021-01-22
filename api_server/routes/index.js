const express = require('express');
const User = require('../controllers/user');
const auth = require('../controllers/auth');

const router = express.Router();

// ========= ROUTES ========= //


router.get('/api/gen_token', (req, res) => {

    const token = auth.gen_token({ username:"user1" , perms:1 });
    res.json({ "TOKEN":token });
    
});


router.get('/api/users', (req, res) => {
    
    User.list_all()
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


router.get('/api/users/:username', auth.validate_auth(1), (req, res) => {

    User.get(req.params.username)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});

module.exports = router;

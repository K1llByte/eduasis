const express = require('express');
const User = require('../controllers/user');

const router = express.Router();

// ========= ROUTES ========= //



router.get('/api/users', function(req, res) {
    // Data retrieve
    User.list_all()
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


module.exports = router;

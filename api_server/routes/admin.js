const express = require('express');
const auth = require('../controllers/auth');
const User = require('../controllers/user');
const Request = require('../controllers/request');

// ================================== //

const router = express.Router();

// ========= AUTH ROUTES ========= //


router.get('/api/admin/requests', auth.authenticate(User.Permissions.Admin), (req, res) => {
    Request.list_all()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(400).json({'error':err.message});
    });
});


router.get('/api/admin/requests/:resource_id',auth.authenticate(User.Permissions.Admin), (req, res) => {
    Request.get()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(400).json({'error':err.message});
    });
});

// ========= OTHER ENDPOINTS ========= //


module.exports = router;
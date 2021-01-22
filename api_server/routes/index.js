const express = require('express');
const User = require('../controllers/user');

const router = express.Router();

// ========= AUTH ========= //

function validate_auth(required_permission = undefined)
{
    if(required_permission == undefined)
        return (req, res, next) => {};
    else
        return (req, res, next) => {};
    
    // // req, res, next
    // if(req.query.token)
    // {
    //     console.log("Bearer Token:",req.query.token);
    //     jwt.verify(req.query.token,'DAW2020', (e,payload) => {
    //         if(e)
    //         {
    //             res.status(401).jsonp({ error : e });
    //         }
    //         else
    //         {
    //             req.user = { 
    //                 lvl : payload.lvl,
    //                 username : payload.username
    //             };
    //             next();
    //         }
    //     });
    //     //// 401 Unauthorized
    //     //next();
    // }
    // else
    // {
    //     console.log("erro1");
    //     res.status(401).jsonp({error: 'Invalid token or non-existing'});
    // }
}

// ========= ROUTES ========= //



router.get('/api/users', (req, res) => {
    
    User.list_all()
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


router.get('/api/users/:username', (req, res) => {

    User.get(req.params.username)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err);
        });
});


module.exports = router;

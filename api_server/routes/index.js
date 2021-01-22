const express = require('express');
const User = require('../controllers/user');

const router = express.Router();

// ========= AUTH ========= //

// TODO: PLACE ALL FORM OF CODE VALIDATION AND TOKEN GENERATION ON A SEPARATED MODULE
function validate_auth(required_permission = undefined)
{
    
    if(required_permission == undefined)
        return (req, res, next) => {
            if(req.query.token /* == undefined */ )
            {
                console.log("Query Param Token:",req.query.token);

                jwt.verify(req.query.token,'DAW2020', (e,payload) => {
                    if(e /* == undefined */)
                    {
                        // 401 Unauthorized
                        res.status(401).jsonp({ error : e });
                    }
                    else
                    {
                        if(required_permission == undefined)
                        {
                            req.user = { 
                                perms : payload.perms,
                                username : payload.username
                            };
                            next();
                        }
                        else if(payload.perms >= required_permission)
                        {
                            req.user = { 
                                perms : payload.perms,
                                username : payload.username
                            };
                            next();
                        }
                        else
                        {
                            // 403 Forbidden
                            res.status(403).jsonp({error: 'Forbidden! Insufficient permissions'});
                        }
                    }
                });
            }
            else
            {
                // 401  Unauthorized
                res.status(401).jsonp({error: 'Invalid token or non-existing'});
            }
        };
    else
        return (req, res, next) => {
            
        };
    
    // // req, res, next
    
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

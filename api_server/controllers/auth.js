const User = require('../models/user');
const jwt = require('jsonwebtoken');



SECRET_KEY = 'DAW2020_EDUASIS'

module.exports.authenticate = (required_permission = undefined) => {
    return (req, res, next) => {
        if(req.query.token /* == undefined */ )
        {
            //console.log("Query Param Token:",req.query.token);

            jwt.verify(req.query.token, SECRET_KEY, (e,payload) => {
                //console.log("IN verify CALLBACK");
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
                        console.log("authorized payload.perms:",payload.perms);
                        req.user = { 
                            perms : payload.perms,
                            username : payload.username
                        };
                        next();
                    }
                    else
                    {
                        //console.log("failed payload.perms:",payload.perms);
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
}


module.exports.gen_token = (data) => {
    
    const token = jwt.sign({
        username: data.username, 
        perms: data.perms, 
        expiresIn: '1d' 
    } , SECRET_KEY);

    return token;
}
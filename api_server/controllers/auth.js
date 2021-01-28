const User = require('../models/user');
const jwt = require('jsonwebtoken');


var SECRET_KEY = 'DAW2020_EDUASIS'


module.exports.fetch_token = (req) =>
{
    if(req.query.token /* == undefined */)
        return req.query.token;

    else if(req.headers['authorization'])    
        return req.headers['authorization'].split(' ')[1];
    
    else
        return undefined;
}

module.exports.authenticate = (required_permission = undefined) => {
    return (req, res, next) => {
        const token = this.fetch_token(req);
        if(token != null)
        {
            jwt.verify(token, SECRET_KEY, (e,payload) => {
                
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
                        console.log(payload.perms);
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
        perms: data.permissions, 
        exp: Math.floor(Date.now() / 1000) + (60*60*24*7) // Expire in a day
    } , SECRET_KEY);

    return token;
}
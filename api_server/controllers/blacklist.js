const jwt = require('jsonwebtoken');

module.exports.Blacklist = class {
    constructor() {
        this.revoked = [];
    }
  
    // Adds a token to blacklist 
    // if it hasn't expired
    add(t) 
    {
        //let exp = jwt.decode(t).payload.expiresIn
        const { exp } = jwt.decode(t);
        this.revoked.push({ "token":t, "exp":exp });
    }

    // Checks if tokens is in list
    has(t) 
    {
        let res = false;
        this.revoked.forEach(e => {
            res = (e.token == t) ? true : res ;
        });
        return res;
    }

    // Clears expired tokens
    clear()
    {
        console.log("this.revoked[0].exp:",this.revoked[0].exp);
        console.log("this.revoked[0]:",this.revoked[0]);
        
        const new_timestamp = Math.floor(Date.now() / 1000);
        this.revoked = this.revoked.filter(e => 
            (new_timestamp < e.exp) );
    }
}
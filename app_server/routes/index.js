const express = require('express');
const axios = require('axios');
const router = express.Router();
const passport = require('passport');
const { post } = require('../app');
const jwt = require('jsonwebtoken');
const FormData = require('form-data');
const multer = require('multer');

const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const fs = require('fs');

API_URL = 'http://localhost:7700/api'

function check_auth(req, res, next)
{
    if(req.isAuthenticated())
    {
        // req.isAuthenticated() will return true if user is logged in
        const decoded = jwt.decode(req.user.token);
        //console.log(decoded);
        req.user.username = decoded.username;
        req.user.perms = decoded.perms;
        next();
    } 
    else
    {
        res.redirect("/login");
    }
}

function auth_header(token)
{
    return {
        headers: { 'Authorization': 'Bearer ' + token }
    }
}

function time_difference(previous_str, current=Date.now()) 
{
    console.log(previous_str);
    let previous = Date.parse(previous_str);
    let ms_per_minute = 60 * 1000;
    let ms_per_hour = ms_per_minute * 60;
    let ms_per_day = ms_per_hour * 24;
    let ms_per_month = ms_per_day * 30;
    let ms_per_year = ms_per_day * 365;

    var elapsed = current - previous;

    if (elapsed < ms_per_minute) 
    {
        return Math.round(elapsed/1000) + ' seconds ago';   
    }
    else if (elapsed < ms_per_hour) 
    {
        return Math.round(elapsed/ms_per_minute) + ' minutes ago';   
    }

    else if (elapsed < ms_per_day ) 
    {
        return Math.round(elapsed/ms_per_hour ) + ' hours ago';   
    }
    else if (elapsed < ms_per_month) 
    {
        return Math.round(elapsed/ms_per_day) + ' days ago';   
    }
    else if (elapsed < ms_per_year) 
    {
        return Math.round(elapsed/ms_per_month) + ' months ago';   
    }
    else 
    {
        return 'approximately ' + Math.round(elapsed/ms_per_year ) + ' years ago';   
    }
}

// ========= TEMPORARY STORAGE ========= //

const storage = multer.diskStorage({
    destination : (req, file, next) => {
        console.log("PASSOU POR AQUI");
        next(null,'tmp');
    },
    filename : (req, file, next) => {
        console.log("PASSOU POR ACULA");
        req.file = file;
        next(null,`file.zip`);
    }
});

const upload = multer({ 
    "storage": storage
});

// ===================================== //

// ---------------------------------------------------------------
//----------- ROTAS NAO NECESSITAM AUTENTICAÇAO ------------------
// ---------------------------------------------------------------

// GET home page
router.get('/', (req, res, next) => {
  // res.render('index', { title: 'Express' });
  res.redirect('login');
});


router.get('/login', (req, res, next) => {
  res.render('login');
});


router.post('/login', passport.authenticate('local'), (req, res) => {
    // Data retrieve
    res.redirect('/eduasis')
});


router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (!err) {
        res.redirect('/');
    } else {
        console.log('Destroy session error: ', err)
    }
  });
});


router.get('/register', (req, res) => {
  // Data retrieve
  res.render('register');

});


router.post('/register', (req, res) => {
    // Data retrieve
    console.log(req.body);
    axios.post(`${API_URL}/register`, {
        username: req.body.username,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password
    })
    .then(dados => {
        console.log('status message:' + dados.status + 'message?' + dados.message);
        if(dados.status == "200")
            res.redirect('/login');
        else
        {
            console.log(dados.status);
            res.redirect('/register');
        }
    })
    .catch(err => res.render('error', {error:err}));
});

// ---------------------------------------------------------------
// ------------- PAGINAS QUE NECESSITAM AUTENTICAÇAO -------------
// ---------------------------------------------------------------

router.get('/eduasis', check_auth, async (req,res) => {

    let resources_p = await axios.get(`${API_URL}/resources`,auth_header(req.user.token));
    let posts_p = await axios.get(`${API_URL}/posts`,auth_header(req.user.token));

    let resources = resources_p.data;
    let posts = posts_p.data;
    res.render('home_page',{
        'posts': posts,
        'resources': resources,
        'user':req.user
    });
});


router.get('/users/:username/edit', check_auth, async (req, res) => {
    if(req.params.username === req.user.username)
    {
        // The _p at the end indicates that 
        // this variable is a promise 
        let user_p = axios.get(
            `${API_URL}/users/${req.user.username}`,
            auth_header(req.user.token));

        let user = (await user_p).data;
        res.render('profile_edit',{
            'user': user,
            'active': 'profile'
        });
    }
    else
    {
        res.status(401).render('error', {err:{"status":401 , "message":"Forbidden"}} );
    }
});


router.post('/users/:username/edit', check_auth, async (req, res) => {
    if(req.params.username === req.user.username)
    {
        // The _p at the end indicates that 
        // this variable is a promise 
        let user_data_p = axios.put(
            `${API_URL}/users/${req.user.username}`,
            {
                nickname: (req.body.nickname == '') ? undefined :req.body.nickname,
                affiliation: (req.body.affiliation == '') ? undefined :req.body.affiliation,
                email: (req.body.email == '') ? undefined :req.body.email
            },
            auth_header(req.user.token));

        if(req.files != undefined)
        {
            let form = new FormData();
            form.append('avatar_img', req.files.avatar_img.data,req.files.avatar_img.name);
            var user_avatar_p = axios.put(
                `${API_URL}/users/${req.user.username}/avatar`,
                form,
                {
                    headers: { 
                        'Authorization': 'Bearer ' + req.user.token,
                        'Content-Type': `multipart/form-data; boundary=${form._boundary}`
                    }
                });
        }

        try {
            await user_data_p;
            if(req.files != undefined)
                await user_avatar_p;
            res.redirect(`/users/${req.user.username}`);
        }
        catch(err) {
            res.status(400).render('error',{"err":err});
        }
    }
    else
    {
        res.status(401).render('error',{err:{"status":401 , "message":"Forbidden"}});
    }
});

router.get('/users/@me', check_auth, async (req, res) => {
    res.redirect(`/users/${req.user.username}`);
});


router.get('/users/:username', check_auth, async (req, res) => {
    
    let username = req.params.username;
    let view_type = 'other';
    if(username ===  req.user.username)
    {
        view_type = 'me';
    }
    

    // The _p at the end indicates that 
    // this variable is a promise 
    let user_p = axios.get(
        `${API_URL}/users/${username}`,
        auth_header(req.user.token));

    let resources_p = axios.get(
        `${API_URL}/resources?author=${username}`,
        auth_header(req.user.token));

    let posts_p = axios.get(
        `${API_URL}/posts/?author=${username}`,
        auth_header(req.user.token));

    try {
        let user = (await user_p).data;
        let resources = (await resources_p).data;
        let posts = (await posts_p).data;

        res.render('profile',{
            "user": user,
            'resources': resources,
            'posts': posts,
            'view_type': view_type,
            'time_difference':time_difference,
            'active': 'profile'
        });
    }
    catch(error) {
        res.render('error',{err: error});
    }
});


//----------- ROUTES NEW RESOURCE/POST --------------------
router.get('/new_resource', check_auth, (req, res) => {

    console.log(req.body)
    axios.get(`${API_URL}/resource_types/`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resource_types=>{
        // console.log(resources_types.data)
        res.render('new_resource',{
            "active": "new_resource", 
            'user':req.user,
            "types":resource_types.data
        });
    })
    .catch(err => res.render('error', {err: err}))
});


//POST new resource
router.post('/new_resource', check_auth, (req, res) => { //upload.single('arquive'),

    //if(req.files == undefined)
    //{
    //    res.render('error',{"err":{"message":"No file provided"}});
    //    return;
    //}

    console.log("Content-Type",req.header("Content-Type"));
    console.log("content-type",req.header("content-type"));

    let form = new FormData();
    form.append('resource_data', req.files.arquive.data,req.files.arquive.name);
    form.append('type_id',req.body.type_id);
    form.append('title',req.body.title);
    form.append('description',req.body.description);
    form.append('visibility',req.body.visibility);
    

    axios.post(`${API_URL}/resources`,form,{
        headers: { 
            'Authorization': 'Bearer ' + req.user.token,
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }
    })
    .then(data => {
        console.log("data",data);
        res.redirect('/resources');
    })
    .catch(err => {
        res.render('error',{"err":err});
    });
});


router.get('/new_post', check_auth, (req, res) => {
    if(req.query.resource_id == undefined)
    {
        res.render('new_post',{
            "active": "new_post",
            'user':req.user
        });
    }
    else
    {
        res.render('new_post',{
            "active": "new_post", 
            'user':req.user,
            "resource_id": req.query.resource_id});
    }
});


//POST new post
router.post('/new_post', check_auth, (req, res) => {
  // Data retrieve
  console.log("req.body",req.body);
  axios.post(`${API_URL}/posts`, req.body, auth_header(req.user.token))
    .then(res.redirect('/eduasis'))
    .catch(err => res.render('error', {err:err}));
});


//----------- ROUTES RESORCES/POSTS --------------------

router.get('/resources', check_auth, (req, res) => {
    
    if(req.query.type_id === '0')
    {
          delete req.query.type_id;
    }

    axios.get(`${API_URL}/resource_types/`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resource_types => {
        axios.get(`${API_URL}/resources/`,{
            headers: { 'Authorization': 'Bearer ' + req.user.token },
            params: req.query
        })
        .then(resources=>{
            res.render('resources',{
                "active": "resources", 
                'user':req.user,
                "types":resource_types.data,
                'time_difference':time_difference,
                "resources":resources.data});
        })
        .catch(err => res.render('error', {err: err}))
    })
    .catch(error => {
        res.render("error",{"err":error});
    });
});


router.get('/posts', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('posts');
});


router.get('/resources/:resource_id', check_auth, (req, res) => {

    axios.get(`${API_URL}/resources/${req.params.resource_id}`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resource => {
        console.log('resource.data',resource.data);
        res.render('resource',{
            "resource":resource.data, 
            'time_difference': time_difference,
            'user':req.user});
    })
    .catch(err => {
        res.render('error', {err: err})
    });
});


router.get('/posts/:post_id', check_auth, (req, res) => {

    res.render('post', {'user':req.user});
});

//----------- ROTAS MANAGER --------------------

router.get('/management', check_auth, (req, res) => {

    res.render('management', {'user':req.user});
});

router.post('/management', check_auth, (req, res) => {

    console.log(req.body);
    axios.post(`${API_URL}/resource_types`,req.body,auth_header(req.user.token))
    .then(data => {
        res.render('management', {'user':req.user});
    })
    .catch(err => {
        res.status(400).render('error', {'err':err});
    });
    
});

module.exports = router;
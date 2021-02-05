const express = require('express');
const auth = require('../controllers/auth');
const User = require('../controllers/user');
const Resource = require('../controllers/resource');
const Post = require('../controllers/post');

// ================================== //

const router = express.Router();

// ========= POST ENDPOINTS ========= //

router.get('/api/posts', auth.authenticate(User.CPermissions.apc), (req, res) => {

    let page_num = 0;
    let page_limit = 20;
    let author = null;

    if(req.query.page_num != undefined)
    {
        page_num = Number(req.query.page_num);
        if(isNaN(page_num))
            res.status(400).json({'error': "Invalid page_num param"});
    }

    if(req.query.page_limit != undefined)
    {
        page_limit = Number(req.query.page_limit);
        if(isNaN(page_limit)) // || page_limit > 100
            res.status(400).json({'error': "Invalid page_limit param"});
    }

    if(req.query.author != undefined)
    {
        author = req.query.author;
    }
    

    
    const options = {
        "page_num" : page_num,
        "page_limit" : page_limit,
        "author" : author
    };

    Post.list_all(options)
        .then(data => { 
            res.json(data);
        })
        .catch(err => { 
            res.json({'error': err});
        });
});


router.get('/api/posts/:post_id', auth.authenticate(User.CPermissions.apc), (req, res) => {

    Post.get(req.params.post_id)
        .then(data => {
            res.json(data);
        })
        .catch(err => { 
            res.json('error', err.message);
        });
});


router.post('/api/posts', auth.authenticate(User.CPermissions.apc), (req, res) => {

    const resource_id = req.body.resource_id;
    const content = req.body.content;

    if(resource_id == undefined)
    {
        res.status(400).json({'error': "Invalid resource_id"});
        return;
    }

    if(content == undefined)
    {
        res.status(400).json({'error': "Invalid content"});
        return;
    }

    Resource.get(resource_id)
    .then(ctx_resource => {
        console.log("ctx_resource:",ctx_resource);
        if(ctx_resource != null)
        {
            Post.insert({
                "resource_id" : resource_id,
                "content" : content,
                "author" : req.user.username,
                "created_date" : Date.now(),
                "comments" : []
            })
            .then(data => {
                res.json({ "success": "Post created successfully" });
            })
            .catch(err => {
                res.status(400).json({'error': err.message});
            });
        }
        else
        {
            res.status(400).json({'error': "Resource doesn't exist"});
        }
    })
    .catch(err => {
        res.status(400).json({'error': err.message});
    });
});


router.post('/api/posts/:post_id/comments', auth.authenticate(User.CPermissions.apc), (req, res) => {

    const MESSAGE_MAX_LENGTH = 1000;
    const message = req.body.message;

    if(message == undefined)
    {
        res.status(400).json({'error': "Invalid message"});
        return;
    }

    if(message.length > MESSAGE_MAX_LENGTH)
    {
        res.status(400).json({'error': "Message size is too big, must be less than 1000 characters"});
        return;
    }

    const comment = {
        "message" : req.body.message,
        "created_date" : Date.now(),
        "author" : req.user.username

    };

    Post.insert_comment(req.params.post_id, comment)
    .then(data => {
        res.json({'success': "Comment created successfully"});
    })
    .catch(err => {
        res.status(400).json({'error': err.message});
    });
});

module.exports = router;
const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs');
// Import Models
const User = require('../controllers/user');
const Resource = require('../controllers/resource');
const ResourceType = require('../controllers/resource_type');
const Post = require('../controllers/post');
const FormData = require('form-data');

const MONGODB_URL = 'mongodb://127.0.0.1/eduasis';
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const AFFILIATIONS = [ 
    "Universidade do Minho", 
    "Universidade do Porto", 
    "Universidade de Coimbra",
    "Universidade de Aveiro",
    "Politécnico de Leiria",
    "Universidade de Lisboa",
    "Universidade do Algarve",
    "Instituto Superior de Economia e Gestão",

];
// ================ //

rand_choice = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// ================ //

let users_success = 0;
let users_error = 0;
let rt_success = 0;
let rt_error = 0;
let resources_success = 0;
let resources_error = 0;
console.log("Preparing database populating ...");

// Define some static users to insert
let users_to_insert = [
    {
        "username":"trina",
        "password":"a_password",
        "email":"trina@mail.com",
        "affiliation": "Universidade do Minho",//rand_choice(AFFILIATIONS),
        "permissions":128
    },
    {
        "username":"jojo",
        "password":"a_password",
        "email":"jojo@mail.com",
        "affiliation": "Universidade do Minho",//rand_choice(AFFILIATIONS),
        "permissions":128
    },
    {
        "username":"jcr",
        "password":"a_password",
        "email":"jcr@di.uminho.pt",
        "affiliation": "Universidade do Minho",
        "permissions":2
    }
]
let rtypes_to_insert = [
    { "type_id" : 1, "name" : "Monograph" },
    { "type_id" : 2, "name" : "Book" },
    { "type_id" : 3, "name" : "Article" },
    { "type_id" : 4, "name" : "Project" },
    { "type_id" : 5, "name" : "Application" },
    { "type_id" : 6, "name" : "Exam" },
    { "type_id" : 7, "name" : "Notes" },
    { "type_id" : 8, "name" : "Other" }
];

function load_users_from_file(filename)
{
    let rawdata = fs.readFileSync(filename);
    return JSON.parse(rawdata);
}

async function add_user(userdata)
{
    User.get(userdata.username)
    .then(data => {
        if(data != null) 
        {
            ++users_error;
            return;
        }
        User.gen_password_hash(userdata.password)
            .then(passwd_hash => {

                const date_now = Date.now();
                User.insert({
                    "username" : userdata.username,
                    "nickname" : "",
                    "password_hash" : passwd_hash,
                    "email" : userdata.email,
                    "affiliation" : userdata.affiliation,
                    "permissions" : userdata.permissions,
                    "registration_date" : date_now,
                    "last_login_date" : date_now,
                    "avatar_url" : ""
                })
                .then(data => {
                    ++users_success;
                })
                .catch(err => {
                    ++users_error;
                });
                
        });
    });
}


function populate_users(users_array)
{
    users_array.forEach(u => {
        add_user(u);
    });
}


function populate_rtypes(rtypes)
{
    rtypes.forEach(rt => {
        ResourceType.insert(rt)
        .then(data => {
            ++rt_success;
        })
        .catch(err => {
            console.log(err);
            ++rt_error;
        });
    });
}


async function populate_resources()
{
    await sleep(3000);
    let payload = await axios.post('http://localhost:7700/api/login/',
        {username: 'jcr', password: 'a_password'});
    let token = payload.data.TOKEN;
    
    fs.readdirSync('zip_bags').forEach(filename => {
        
        const description = `File(s) from jcr XML documents collection.
All documents can be listed in http://www4.di.uminho.pt/~jcr/XML/didac/xmldocs/

Note: This resource was automaticly generated`;

        // API server must be running for this populate to succeed
        let form = new FormData();
        form.append('resource_data',fs.createReadStream(`zip_bags/${filename}`));    
        form.append('type_id','8');
        form.append('title',`XML Documents: ${filename.slice(0, -4)}`);
        form.append('description',description);
        form.append('visibility','0');
        

        axios.post('http://localhost:7700/api/resources',form,{
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }
        })
        .then(data => {
            ++resources_success;
        })
        .catch(err => {
            ++resources_error;
        });
    });
}


async function print_values()
{
    console.log("Users: ",users_success,"Created",users_error,"Not created");
    console.log("Resource Types: ",rt_success,"Created",rt_error,"Not created");
    console.log("Resources: ",resources_success,"Created",resources_error,"Not created");
}


async function populate()
{
    users_to_insert = users_to_insert.concat(load_users_from_file('users.json'));
    await populate_users(users_to_insert);
    console.log('Users finished');

    await populate_rtypes(rtypes_to_insert);
    console.log('Resource Types finished');

    await populate_resources();
    console.log('Resources finished');

    print_values();
}

populate()
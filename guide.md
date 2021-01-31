# Guide

- [Project Description](#Project-Description)
    - [HTTP Server](#HTTP-Server)
    - [API Server](#API-Server)
    - [Database Server](#Database-Server)
- [Extra](#Extra)
    - [TODO](#TODO)
    - [Questions](#Questions)


## Project Description

A Educational platform to share serveral types of arquives such as books, essays, appointments, projects, etc... Users can get content or be a producer of content. Administrators approve content submited by the producers.

There's concepts for:
- User
    - Permissions (Administrator, Producer, Consumer)
- Resources
    - Comments on resources
- Posts

The development of this system will produce 3 servers:
- HTTP server
- API server
- DB server

Their dependencies from each other are:
- API -> DB
- HTTP -> API

### HTTP Server

A http server to provide app view for the client using a browser. This component will only provide those views and redirect a corresponding request to the API server.

This server might be isolated from the API (at the hardware level) so this will be hosteed in `domain.app`.

```
               DB
               ^
-------------- | ------
               v
 [HTTP] <-->  API
   ^
   |
   v
  Client
```

### API Server

The core of the service, operates over data and controls the behavior of the system.

A *json* API server with CRUD operations over the database

This server might be isolated from the HTTP (at the hardware level) so this will be hosteed in `api.domain.app`.

```
               DB
               ^
-------------- | ------
               v
  HTTP  <--> [API]
   ^
   |
   v
  Client
```

#### Routes

```

[Done] GET /login
[Done] GET /logout
[Done] GET /register

[Done] GET /users
[Done] GET /users/:username
[Done] PUT /users/:username
[Done] POST /users/:username/avatar


GET /posts
GET /posts/:post_id
POST /posts

[Done] GET /resources
[Done] POST /resources
[Done] GET /resources/:resource_id

GET /resources_types/
GET /resources_types/:type_id

```

### Database Server

The database for the whole system, every user and global data will be stored here.

```
              [DB]
               ^
-------------- | ------
               v
  HTTP  <-->  API
   ^
   |
   v
  Client
```

Some usefull regular expressions:

username_restrictions = <br/>
base64_match = ([a-zA-Z0-9+\\=]{4})+<br/>
base64_pwhash_with_separator = ([a-zA-Z0-9+\\=]{4})+:([a-zA-Z0-9+\\=]{4})+<br/>

- User
    - username      -> String //
    - nickname      -> String //
    - password_hash -> String /base64_match:base64_match/
    - email         -> String //
    - affiliation   -> String /.{128}/
    - permissions   -> Number
    - registration_date -> Date
    - last_login_date   -> Date


- Resource
    - resource_id -> String
    - title       -> String
    - description -> String
    - files       -> [String]
    - create_date -> Date
    - visibility  -> Number
    - rate
        - current_rate -> Number
        - num_rates    -> Number

- Post
    - post_id      -> String
    - resource_id  -> String
    - content      -> String
    - author       -> String
    - created_date -> Date
    - comments     -> [
        - message      -> String,
        - created_date -> Date,
        - author       -> String
    ]

___
## Extra

### TODO

- [x] API Authentication
- [ ] Configuration module (load from file to vars)
- [ ] All models
    - [x] Resource model
    - [x] Post model
    - [ ] Resource controller
    - [ ] Post controller
    - [ ] Unapproved Resource model
- [ ] All endpoints
    - [ ] User admin CRUD endpoints
    - [ ] Resource endpoints
    - [ ] Post endpoints

### Permission Table

|                  | Guest | Consumer | Producer | Admin |
|:----------------:|:-----:|:--------:|:--------:|:-----:| 
| Add Posts        |       | X        | X        | X     |
| Add Resources    |       |          | X        | X     |
| Manage Resources |       |          |          | X     |

### Questions

1. Há criação de "recursos" e "posts".  
Um utilizador pode criar "posts" sobre um "recurso".  
Esse utilizador que cria o post pode ser tanto um <ins>produtor</ins> qualquer como um <ins>consumidor</ins> qualquer?

2. O que é que significa "A estrutura do pacote deverá ser verificada contra o manifesto"?


### Project Structure

- `routes/` Javascript modules with router objects to isolate routes context

- `views/` Dynamic views using pug

- `static/` Static views and resources

- `models/` Javascript database schemes

- `controllers/` Javascript model wrappers to provide data access abstraction
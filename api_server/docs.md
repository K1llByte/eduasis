# API Documentation


## Index

<ins>Authentication</ins>

**POST /api/login**<br/>
**POST /api/logout**<br/>
**POST /api/register**<br/>

<ins>Users</ins>

**GET /users**<br/>
**GET /users/:username**<br/>
**PUT /users/:username**<br/>
**DELETE /users/:username**<br/>
**GET /users/:username/avatar**<br/>
**PUT /users/:username/avatar**<br/>

<ins>Posts</ins>

**GET /posts**<br/>
**GET /posts/:post_id**<br/>
**POST /posts**<br/>
**DELETE /posts/:post_id**<br/>
**POST /posts/:post_id/comments**<br/>

<ins>Resources</ins>

**GET /resources**<br/>
**GET /resources/:resource_id**<br/>
**POST /resources**<br/>
**DELETE /resources/:resource_id**<br/>
**GET/resources/:resource_id/download**<br/>
**GET /resources/:resource_id/rate**<br/>
**PUT /resources/:resource_id/rate**<br/>
**GET /resources/:resource_id/posts**<br/>

**GET /resource_types**<br/>
**POST /resource_types**<br/>
**DELETE /resource_types/:type_id**<br/>
**GET /resource_types/:type_id**<br/>

___
## `GET /users/:username`

### **Notes**
To get immediatly the information about you if you're logged in, you can access `/users/@me`
___
## `GET /posts`

### **URL Params**

**Optional:**

author=\<String> <br/>
page_num=\<Integer> <br/>
page_limit=\<Integer> <br/>

### **Success Response**

- Code: 200
- Content:
```
[
    {
        "resource_id": "YBM9BXlBZJNhrTmq",
        "content": "Isto é uma pouca vergonha!!!",
        "author": "test",
        "created_date": "2021-02-02T23:34:58.865Z",
        "comments": [
            {
                "message": "Concordo",
                "created_date": "2021-02-03T12:26:48.970Z",
                "author": "jojo"
            }
        ],
        "post_id": "YBnhogXIQEECv3jj"
    }
]
```

### **Error Response**
- Code: 404
- Content:
> WIP
```


___
## `GET /resources`

### **URL Params**

**Optional:**

search_term=\<String>

type_id=\<String>

author=\<String>

page_num=\<Integer>

page_limit=\<Integer>
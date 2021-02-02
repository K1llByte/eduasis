#!/bin/python
import json
import random

AFFILIATIONS =[ 
    "Universidade do Minho", 
    "Universidade do Porto", 
    "Universidade de Coimbra",
    "Universidade de Aveiro",
    "Politécnico de Leiria",
    "Universidade de Lisboa",
    "Universidade do Algarve",
    "Instituto Superior de Economia e Gestão"
]

FILE = 'users.json'
with open(FILE,'r') as fin:
    data = json.load(fin)

new_data = []
for u in data['results']:
    new_data.append(
        {
        "username" : u['login']['username'],
        "password" : u['login']['password'],
        "email" : u["email"],
        "affiliation" : random.choice(AFFILIATIONS),
        "permissions": 1
    })

with open(FILE,'w') as fout:
    json.dump(new_data,fout, indent=4)
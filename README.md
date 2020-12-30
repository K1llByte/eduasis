# Eduasis

A project dedicated for Web App Dev 

A Educational platform to share serveral types of arquives such as books, essays, appointments, projects, etc... Users can get content or be a producer of content of an admin allows him to (Permission system).


This platform will be a web application server made in `javascript` with `mongodb`.

___
## Aux

Ha uma noção de:

- Utilizadores
- Recursos
- Posts
- Comentários nos recursos
- Permissoes (Administrator, Producer, Consumer)

### Duvidas

1. Há criação de "recursos" e "posts".  
Um utilizador pode criar "posts" sobre um "recurso".  
Esse utilizador que cria o post pode ser tanto um <ins>produtor</ins> qualquer como um <ins>consumidor</ins> qualquer?

2. O que é que significa "A estrutura do pacote deverá ser verificada contra o manifesto"?

### Database

- User
    - username
    - password_hash
    - email
    - affiliation (se é estudante, docente, curso, departamento, ...)
    - permissions
    - registration_date
    - last_login_date


- Resource
    - title
    - description
    - files: list[Files]
    - datetime
    - rate
        - current_rate
        - num_rates

- Post
    - resource
    - comments: list[Comment]

### Routes

GET /user
GET /login
GET /register

___
## Project Structure

- `routes/` Javascript modules with router objects to isolate routes context

- `views/` Dynamic views using pug

- `public/` Static views and resources

- `models/` Javascript database schemes

- `controllers/` Javascript model wrappers to provide data access abstraction
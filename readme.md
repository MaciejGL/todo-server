# To-do Backend
It's a early stage backend for Todo app. 

## Stack
For now we are setting up the following stack

### Backend
* Node JS 12.19.x
* Express 4.17.x
* GraphQl 15.3.x
* MongoDB 4.4.x
* Mongoose 5.10.x

### Frontend
* Soon ...

### Hosting
* Soon ...

### Schemas GraphQL
```graphql
type Task {}
type User {}
```
### Models Mongoose
```javascript
Task ({})
User ({})
```

## Setting up your dev environment
To install locally follow the directions in the MongoDB documentation.

`npm install`

To run server

`npm start`

## TO_DO
---
| Name          | Priority | Description | Info |
| ------------- |:------:  | --------------|-----:|
| `validation`  |  sprint  | create email and password  | `joi/validator` |
| `cleaning`    |  sprint  | async cleaning using `try catch` | create mother function |
| `separate`    |  sprint  | accordingly to functionality | `Resolvers/Schemas` |
---
| Name          | Priority | Description |
| ------------- |:------:  | --------------|
| `Mutation`    |  run    | delete user  | 
| `Mutation`    |  run    | update task |
| `Mutation`    |  run    | delete task |
| `Query`       |  run    | get one for user |

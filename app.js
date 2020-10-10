const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql')
const { importSchema } = require('graphql-import')

const schema = buildSchema(importSchema('./schema/task.gql'))
const resolvers = require('./resolvers/task')

const app = express();

app.use('/graphql',
  graphqlHTTP( {
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASSWORD}@cluster0.dpnjy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  () => {
    app.listen(4000);
  }
);

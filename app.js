const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql')
const { importSchema } = require('graphql-import')

const schema = buildSchema(importSchema('./schema/schemas.gql'))
const resolvers = require('./resolvers/index')

const isAuth = require('./middleware/is-auth')

const app = express();

app.use(isAuth)

app.use('/graphql',
  graphqlHTTP( {
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    customFormatErrorFn: (error) => ({
      message: error.message || "An error occurred.",
      code: error.originalError.code || 500,
      data: error.originalError.data,
      you: "suck",
    }),
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASSWORD}@cluster0.dpnjy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  () => {
    app.listen(4000);
  }
);

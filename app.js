const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const schema = require('./schema/');
const resolvers = require('./resolvers/index');

const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
	  'Access-Control-Allow-Methods',
	  'OPTIONS, GET, POST',
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
	  return res.sendStatus(200);
	}
	next();
  })

app.use(isAuth);

app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		rootValue: resolvers,
		graphiql: true,
		customFormatErrorFn: (error) => ({
			message: error.message || 'An error occurred.',
			code: error.originalError ? error.originalError.code : 500,
			data: error.originalError ? error.originalError.data : null,
		}),
	})
);

mongoose.connect(
	`mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASSWORD}@cluster0.dpnjy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		app.listen(4000);
	}
);

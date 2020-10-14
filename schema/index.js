const { buildSchema } = require('graphql');

const tasks = require('./taskSchema');
const users = require('./userSchema');

module.exports = buildSchema(`
	${tasks}
	${users}

	type Mutation {
		createTask(taskInput: TaskInputData!): Task!
		updateTask(id: ID!, taskInput: TaskInputData!): Task!
		deleteTask(id: ID!): Task!
		createUser(userInput: UserInputData!): User!
		updateUser(userInput: UserUpdateInput!): User!
		deleteUser(password: String!): User!
	}
	type Query {
		getTasks: [Task!]!
		getTask(id: ID!): Task!
		login(email: String!, password: String!): AuthData!
	}
`);

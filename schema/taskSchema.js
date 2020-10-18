module.exports = `
	input TaskInputData {
		title: String!
		subtitle: String
		description: String
		accomplished: Boolean
	}

	type Task {
		_id: ID!
		title: String!
		subtitle: String
		description: String
		accomplished: Boolean!
		creator: User
		createdAt: String
		updatedAt: String
	}

	type TasksData {
		tasks: [Task!]!
		totalTasks: Int
	}
`;

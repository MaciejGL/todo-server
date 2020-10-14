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
		createdAt: String
		updatedAt: String
	}
`;

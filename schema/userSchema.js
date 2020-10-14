module.exports = `
    type User {
        _id: ID!
        name: String!
        email: String!
        tasks: [Task!]!
        createdAt: String
        updatedAt: String
    }

    input UserInputData {
        name: String!
        email: String!
        password: String!
    }

    input UserUpdateInput {
        name: String
        email: String
        password: String!
        newPassword: String
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
`;

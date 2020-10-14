const taskResolvers = require('./task');
const userResolvers = require('./user');

const rootResolver = {
    ...taskResolvers,
    ...userResolvers,
};

module.exports = rootResolver;

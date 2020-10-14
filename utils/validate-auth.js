const validator = require('validator');

exports.validateCreateUser = (userInput) => {
    const isValidEmail = validator.isEmail(userInput.email);
    const isValidName = validator.isLength(userInput.name, { min: 3});
    const isValidPassword = validator.isLength(userInput.password, { min: 8});
    if (!isValidEmail || !isValidName || !isValidPassword) {
        const err = new Error('Invalid credentials.');
        err.code = 422;
        throw err;
    }
};

exports.validateLogin = (email) => {
    if (!validator.isEmail(email)) {
        const err = new Error('Invalid credentials.');
        err.code = 422;
        throw err;
    }
};

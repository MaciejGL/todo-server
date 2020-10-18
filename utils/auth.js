const validator = require('validator');
const bcrypt = require('bcrypt');

module.exports = {
	isAuth: (isAuth) => {
		if (!isAuth) {
			const err = new Error('You are not authorized.');
			err.code = 401;
			throw err;
		}
	},
	validateCreateUser: (userInput) => {
		const isValidEmail = validator.isEmail(userInput.email);
		const isValidName = validator.isLength(userInput.name, { min: 3 });
		const isValidPassword = validator.isLength(userInput.password, { min: 8 });
		if (!isValidEmail || !isValidName || !isValidPassword) {
			const err = new Error('Invalid credentials.');
			err.code = 422;
			throw err;
		}
	},
	validateLogin: (email) => {
		if (!validator.isEmail(email)) {
			const err = new Error('Invalid credentials.');
			err.code = 422;
			throw err;
		}
	},
	validatePassword: async (password, userPassword) => {
		const isEqual = await bcrypt.compare(password, userPassword);
		if (!isEqual) {
			const err = new Error('Incorrect password.');
			err.code = 401;
			throw err;
		}
	},
};

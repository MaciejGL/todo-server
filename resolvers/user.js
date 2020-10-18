const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { isAuth, validatePassword, validateCreateUser, validateLogin } = require('../utils/auth');
const { validator } = require('validator');

exports.createUser = async ({ userInput }) => {
	validateCreateUser(userInput);
	try {
		const userExists = await User.findOne({ email: userInput.email });
		if (userExists) {
			const err = new Error('User already exists.');
			err.code = 400;
			throw err;
		}
		const hashedPassword = await bcrypt.hash(userInput.password, 12);

		const user = new User({
			name: userInput.name,
			email: userInput.email,
			password: hashedPassword,
		});
		const savedUser = await user.save();
		return savedUser;
	} catch (error) {
		throw error;
	}
};

exports.login = async ({ email, password }) => {
	validateLogin(email);
	try {
		const user = await User.findOne({ email });
		if (!user) {
			const err = new Error('User with this email not found.');
			err.code = 404;
			throw err;
		}

		await validatePassword(password, user.password);

		const token = jwt.sign({ userId: user._id, email }, 'glupitext', { expiresIn: '1h' });

		return {
			userId: user._id,
			token: token,
			tokenExpiration: 1,
		};
	} catch (error) {
		throw error;
	}
};

exports.updateUser = async ({ userInput }, req) => {
	isAuth(req.isAuth);
	try {
		const user = await User.findById(req.userId);
		await validatePassword(userInput.password, user.password);
		if (userInput.newPassword && validator.isLength(userInput.newPassword, { min: 8 })) {
			const hashedPassword = await bcrypt.hash(userInput.newPassword, 12);

			const updatedUserAndPassword = await User.findByIdAndUpdate(
				req.userId,
				{
					name: userInput.name ? userInput.name : user.name,
					email: userInput.email ? userInput.email : user.email,
					password: hashedPassword,
				},
				{ new: true }
			);
			return updatedUserAndPassword;
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.userId,
			{
				name: userInput.name ? userInput.name : user.name,
				email: userInput.email ? userInput.email : user.email,
			},
			{ new: true }
		);
		return updatedUser;
	} catch (error) {
		throw error;
	}
};

exports.deleteUser = async ({ password }, req) => {
	isAuth(req.isAuth);
	try {
		const user = await User.findById(req.userId);
		await validatePassword(password, user.password);
		const deletedUser = await user.deleteOne();
		return deletedUser;
	} catch (error) {
		throw error;
	}
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/user')

exports.createUser = async ({userInput}) => {
    const isValidEmail = validator.isEmail(userInput.email);
    const isValidName = validator.isLength(userInput.name, { min: 3})
    const isValidPassword = validator.isLength(userInput.password, { min: 8})
    if (!isValidEmail || !isValidName || !isValidPassword) {
        const err = new Error('Invalid credentials.')
        err.code = 422
        throw err
    }
    try {
        const userExists = await User.findOne({email: userInput.email})
        if (userExists) {
            const err = new Error('User already exists.')
            err.code = 400;
            throw err
        }
        const hashedPassword = await bcrypt.hash(userInput.password, 12);

        const user = new User({
            name: userInput.name,
            email: userInput.email,
            password: hashedPassword
        });
        const savedUser = await user.save()
        return savedUser
    } catch (error) {
        throw error
    }
}

exports.login = async ({email, password}) => {
    if (!validator.isEmail(email)) {
        const err = new Error('Invalid credentials.')
        err.code = 422
        throw err
    }
    try {
        const user = await User.findOne({email});
        if (!user) {
            const err = new Error('User with this email not found.')
            err.code = 404;
            throw err
        }
    
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            const err = new Error('Incorrect password.')
            err.code = 401;
            throw err
        }
    
        const token = jwt.sign({userId: user._id, email}, 'glupitext', {expiresIn: '1h'});
    
        return {
            userId: user._id,
            token: token,
            tokenExpiration: 1
        }
    } catch (error) {
        throw error
    }

}
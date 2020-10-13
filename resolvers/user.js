const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user')

const {validateCreateUser, validateLogin } = require('../utils/validate-auth')

exports.createUser = async ({userInput}) => {
    validateCreateUser(userInput)
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
    validateLogin(email)
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
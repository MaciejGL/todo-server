const bcrypt = require('bcrypt');

exports.validatePassword = async (password, userPassword) => {
    const isEqual = await bcrypt.compare(password, userPassword)
console.log({isEqual});

    if (!isEqual) {
        const err = new Error('Incorrect password.')
        err.code = 401;
        throw err
    }
}
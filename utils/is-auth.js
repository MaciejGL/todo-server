exports.isAuth = (isAuth) => {
    if (!isAuth) {
        const err = new Error('You are not authorized.')
        err.code = 401;
        throw err;
    }
}
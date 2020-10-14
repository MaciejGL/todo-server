const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authorization = req.get('Authorization');
    if (!authorization) {
      req.isAuth = false;
      return next();
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      req.isAuth = false;
      return next();
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'glupitext');
    } catch (error) {
      req.isAuth = false;
      return next();
    }

    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    if (decodedToken.exp < Date.now()) {
      if (!decodedToken) {
        req.isAuth = false;
        return next();
      }
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  }

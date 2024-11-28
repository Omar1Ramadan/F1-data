// Middleware to check if the user is authenticated
const checkAdmin = (req, res, next) => {
    if (!req.session.admin) {
      return res.status(403).send('Access denied');
    }
    next();
  };
  
  module.exports = checkAdmin;
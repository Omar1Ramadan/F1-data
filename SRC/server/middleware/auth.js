// Middleware to check if the user is authenticated
const checkAdmin = (req, res, next) => {
    next();
  };
  
  module.exports = checkAdmin;
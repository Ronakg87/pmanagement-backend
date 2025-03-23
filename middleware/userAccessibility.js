const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../model/userModel");

const UserCreationAccess = async (req, res, next) => {
  
try {
    if(req.user.role !== 'admin'){
        return res.status(403).send('Access denied');
    }
} catch (error) {
    console.log(error);
}
  next();
};

module.exports = UserCreationAccess;

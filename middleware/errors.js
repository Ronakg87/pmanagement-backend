const {validationResult} = require('express-validator');

const checkBody = (req , res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error: errors.array() , code:400});
  }
  next();
}

module.exports = checkBody;
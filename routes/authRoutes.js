const express = require('express');
const { body } = require('express-validator');
const user_controller = require('../controller/userController');
const errors = require('../middleware/errors');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({
    minLength: 8, maxLength: 20, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
  }),
  errors,
  user_controller.user_login
);

router.get('/auth', auth, user_controller.auth);
module.exports = router;

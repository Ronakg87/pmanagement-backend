const express = require('express');
const { body } = require('express-validator');
const user_controller = require('../controller/userController');
const errors = require('../middleware/errors');
const auth = require('../middleware/auth');
const UserCreationAccess = require('../middleware/userAccessibility');
const router = express.Router();

router.post('/create-user',
  auth, UserCreationAccess,
  body('name').not().isEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({
    minLength: 8, maxLength: 20, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
  }),
  body('role').not().isEmpty(),
  errors,
  user_controller.register_user
);

router.post('/update-password',
  auth,
  body('password').isStrongPassword({
    minLength: 8, maxLength: 20, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
  }),
  errors,
  user_controller.update_password
);

router.route('/user/:id')
  .patch(auth, user_controller.updateuser)
  .get(auth, user_controller.getuser);

router.get('/allusers', auth, UserCreationAccess, user_controller.getAllUsers);

router.post('/get-users', auth, UserCreationAccess, user_controller.getuserbyids);

module.exports = router;
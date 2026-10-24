const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, changePassword } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { registerValidator, loginValidator, changePasswordValidator } = require('../validators/authValidators');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.patch('/change-password', authenticate, changePasswordValidator, changePassword);

module.exports = router;

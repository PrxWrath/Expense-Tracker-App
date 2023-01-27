const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/user-signup', userController.postAddUser);
router.post('/user-login', userController.postFindUser);

module.exports = router;
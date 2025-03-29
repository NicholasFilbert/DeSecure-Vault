const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/default.controller')

// const userController = require('../controllers/user.controller');
// const validate = require('../validations/user.validation');
// const authMiddleware = require('../middlewares/auth');

router.get('/', defaultController.test);

module.exports = router;

const express = require('express');
const router = express.Router();

// const userRoutes = require('./user.routes');
const defaultRoutes = require('./default.routes')

router.use('/', defaultRoutes)
// router.use('/users', userRoutes);


module.exports = router;

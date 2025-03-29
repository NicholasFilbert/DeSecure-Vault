// const userService = require('../services/user.service');

exports.test = async (req, res, next) => {
    try {
        // const user = await userService.createUser(req.body);
        res.status(201).json('Testing Called!');
    } catch (error) {
        next(error);
    }
};

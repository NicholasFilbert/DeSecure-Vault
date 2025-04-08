// const userService = require('../services/user.service');
import pool from "../config/db.js";

export const test = async (req, res, next) => {
    try {
        const result = await pool.query('select * from users');
        res.json(result.rows);
      } catch (err) {
        console.error('Error in getUsers:', err);
        res.status(500).send('Server Error');
      }
};

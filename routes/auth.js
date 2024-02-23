const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

// Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser',
  [
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password').isLength({ min: 5 })],
  async (req, res) => {

    // If there are no errors
    const result = validationResult(req);
    if (result.isEmpty()) {
      // Check whether user with same email exists already
      try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(400).json({ error: "User with this email already exists!" })
        }
        user = await User.create({
          name: req.body.name,
          password: req.body.password,
          email: req.body.email
        })
        res.json({ user })

      } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
      }

    }



  })

module.exports = router;
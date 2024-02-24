const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Somethingisgoodtoday'

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

      try {
        // Check whether user with same email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(400).json({ error: "User with this email already exists!" })
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);
        // create a new user in DB
        user = await User.create({
          name: req.body.name,
          password: secPass,
          email: req.body.email
        });

        const data = {
          user: {
            id: user.id
          }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ authToken })

      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error!");
      }

    }



  })

// Authenticate a User using: POST "/api/auth/login".
router.post('/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', "Password can't be blank").exists()],
  async (req, res) => {
    // If there are no errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() })
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Please try to login with correct credentails" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Please try to login with correct credentails" });
      }

      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken })
    } catch (err) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  });

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser".

router.get('/getuser', fetchuser, async (req, res) => {

  try {
   userId = req.user.id
   const user = await User.findById(userId).select("-password");
   res.send(user)
  } catch (err) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
  
})

module.exports = router;
const express = require('express')
const router = express.Router();
const Note = require('../models/Notes');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all the notes using: Get "/api/auth/fetchallnotes". Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
})


// ROUTE 2: Add a new note using: POST "/api/auth/addnote". Login Required
router.post('/addnote', fetchuser,
  [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', "Description must be atkeast 5 characters").isLength({ min: 5 })],
  async (req, res) => {

    try {

      const { title, description, tag } = req.body;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() })
      }
      const note = new Note({
        title, description, tag, user: req.user.id
      })
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (err) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  })

module.exports = router;
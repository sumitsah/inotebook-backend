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

// ROUTE 3: update an existing note using: PUT "/api/auth/updatenote". Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

  try {
    const { title, description, tag } = req.body;
    // create new note
    const newNote = {};
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    // const savedNote = await note.save();
    res.json({ note });
  } catch (err) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

// ROUTE 4: Delete an existing note using: DELETE "/api/auth/deletenote". Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

  try {
    // create new note
    const newNote = {};
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    // Find the note to be delete and delete it
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    // const savedNote = await note.save();
    res.json({"Success": "Note has been deleted", note: note });
  } catch (err) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
})
module.exports = router;
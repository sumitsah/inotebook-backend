const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
   user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
   },
  title: {
   type: String, // String is shorthand for {type: String}
     required: true
  },
  description: {
   type: String,  // String is shorthand for {type: String}
    required: true,
 },
  tag: {
   type: String, 
    default:"General"
 },
 date: {
   type: String, // String is shorthand for {type: String}
    default: Date.now
 },
});

const Note = mongoose.model('notes', NotesSchema);
module.exports = Note;
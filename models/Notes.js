import mongoose from 'mongoose';
const { Schema } = mongoose;

const NotesSchema = new Schema({
  title: {
     String, // String is shorthand for {type: String}
     required: true
  },
  description: {
    String, // String is shorthand for {type: String}
    required: true,
 },
  tag: {
    String,
    default:"General"
 },
 date: {
    String, // String is shorthand for {type: String}
    default: Date.now
 },
});

module.exports = mongoose.model('user', NotesSchema);
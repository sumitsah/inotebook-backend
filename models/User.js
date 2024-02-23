const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
   name: {
      type: String, // String is shorthand for {type: String}
        required: true
   },
   email: {
      type: String, // String is shorthand for {type: String}
       required: true,
       unique: true
   },
   password: {
      type: String, // String is shorthand for {type: String}
       required: true
   },
   date: {
      type: String, // String is shorthand for {type: String}
      default: Date.now
   },
});

const User = mongoose.model('user',UserSchema)
// User.createIndexes(); create indexes in the db and enforce unique email
module.exports = User;
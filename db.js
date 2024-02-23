const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&tls=false";
const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = async () => {
    try {
      const conn = await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

module.exports = connectToMongo;

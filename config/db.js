const mongoose = require('mongoose');
const colors = require('colors');

const connectDb = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected".bgGreen.white);
  }catch(err){
    console.log(`MongoDb server issue ${err}`.bgRed.white);
  }

};

module.exports = connectDb;
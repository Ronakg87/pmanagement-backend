const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = () => {
    mongoose.connect(process.env.MONGOURI)
    .then(() => console.log(`Connected to MongoDB successfully.`))
    .catch((error) => console.error(`MongoDB connection failed: ${error.message}`));
};

module.exports = connectToMongo;
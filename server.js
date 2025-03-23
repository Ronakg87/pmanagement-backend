const app = require('./app');
require("dotenv").config();
const connectToMongo = require('./config/db');

const PORT = process.env.PORT || 5000

connectToMongo();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
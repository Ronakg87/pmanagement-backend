const app = require('./app');
// const express = require("express");
require("dotenv").config();
const connectToMongo = require('./config/db');

const PORT = process.env.PORT || 5000

// const app = express();
// app.use(express.json());
// app.use(cors());

app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

connectToMongo();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
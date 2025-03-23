const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);

module.exports = app;
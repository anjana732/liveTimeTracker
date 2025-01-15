'use strict';

const express = require('express');
const timeEntryRoutes = require('./routes/timeEntry');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log('Request received:', {
        method: req.method,
        path: req.path,
        body: req.body
    });
    next();
});

app.use('/user', userRoutes);          
app.use('/timeEntry', timeEntryRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

module.exports = app;

const express = require('express');
const { handleTimeEntry, handleGetTimeEntry, handleGetTimeEntryById, handleGetTimeEntryByDate, handleUpdateTimeEntry } = require('../controllers/timeEntiries');
const router = express.Router();

// Time entry routes
router.post('/', handleTimeEntry);
router.get('/', handleGetTimeEntry);  
router.get('/id', handleGetTimeEntryById);
router.get('/date', handleGetTimeEntryByDate);
router.put('/update',handleUpdateTimeEntry)

module.exports = router; 
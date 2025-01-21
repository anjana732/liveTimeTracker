const express = require('express');
const { 
    handleTimeEntry, 
    handleGetTimeEntry, 
    handleGetTimeEntryById, 
    handleGetTimeEntryByDate,
    handleGetTimeEntryByName 
} = require('../controllers/timeEntiries');

const router = express.Router();

router.post('/', handleTimeEntry);
router.get('/', handleGetTimeEntry);
router.get('/id', handleGetTimeEntryById);
router.get('/date', handleGetTimeEntryByDate);
router.get('/name', handleGetTimeEntryByName);

module.exports = router; 
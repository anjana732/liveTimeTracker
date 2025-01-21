const express = require ('express');
const {handleGetTimeEntryWithDate} = require('../controllers/sheetTimeEntry')
const router = express.Router();

router.get('/EntryWithDate', handleGetTimeEntryWithDate);

module.exports = router
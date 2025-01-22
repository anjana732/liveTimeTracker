const express = require ('express');
const {handleGetTimeEntryWithDate, handleSheetDataByNameAndDate} = require('../controllers/sheetTimeEntry')
const router = express.Router();

router.get('/EntryWithDate', handleGetTimeEntryWithDate);
router.get('/getEntryWithName',handleSheetDataByNameAndDate);

module.exports = router
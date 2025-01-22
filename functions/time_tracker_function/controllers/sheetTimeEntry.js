const catalyst = require('zcatalyst-sdk-node');
const { sendErrorResponse } = require('../utils/error');

async function handleGetTimeEntryWithDate(req, res) {
    const catalystApp = catalyst.initialize(req); 
    const { fromDate, toDate } = req.query;

    try {
        const result = await getTimeEntryWithDate(catalystApp, fromDate, toDate);
        console.log(result)

        if (!result) {
            throw new Error('No data received from database for From and to date time Entry');
        }

        res.status(200).json({
            status: "success",
            message: "Time Entries for from and to date Fetched Successfully",
            data: result
        });
    } catch (err) {
        console.error("Error fetching time entries for from and to date Fetched Successfully:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Error fetching time entries for from and to date Fetched Successfully"
        });
    }
}


async function getTimeEntryWithDate(catalystApp, fromDate, toDate) {
    return new Promise((resolve, reject) => {
        try {
            const query = `
            SELECT * 
            FROM TimeEntries 
            WHERE entryDate >= '${fromDate}' AND entryDate <= '${toDate}'
            `;
            console.log("Executing time entry with from and to date", query);
            catalystApp.zcql().executeZCQLQuery(query)
                .then(queryResponse => {
                    console.log('Time entries fetched with From and to date:', queryResponse);
                    resolve(queryResponse);
                }).catch(err => {
                    console.error('Database error to fetch time entry with from and to date:', err);
                    reject(new Error(`Database query failed for from and to date: ${err.message}`));
                });
        } catch (error) {
            console.error("Error fetching time entries for from and to date:", error);
            res.status(500).json({ error: "Internal server error in from and to date" });
        }

    });
}

async function getSheetDataByNameAndDate(catalystApp, email, fromDate, toDate){
    return new Promise((resolve, reject) => {
        try {
            const query = `
            SELECT * 
            FROM TimeEntries 
            WHERE entryDate >= '${fromDate}' 
            AND entryDate <= '${toDate}' 
            AND email = '${email}'`;
            console.log("Executing time entry with from and to date", query);
            catalystApp.zcql().executeZCQLQuery(query)
                .then(queryResponse => {
                    console.log('Time entries fetched with From and to date:', queryResponse);
                    resolve(queryResponse);
                }).catch(err => {
                    console.error('Database error to fetch time entry with from and to date:', err);
                    reject(new Error(`Database query failed for from and to date: ${err.message}`));
                });
        } catch (error) {
            console.error("Error fetching time entries for from and to date:", error);
            res.status(500).json({ error: "Internal server error in from and to date" });
        }

    });
}


async function handleSheetDataByNameAndDate(req, res){
    const catalystApp = catalyst.initialize(req); 
    const{email,fromDate, toDate} = req.query;

    try {
        const result = await getSheetDataByNameAndDate(catalystApp, email, fromDate, toDate);
        console.log(result)

        if (!result) {
            throw new Error('No data received from database for From and to date time Entry with Name');
        }

        res.status(200).json({
            status: "success",
            message: "Time Entries for from and to date with Fetched Successfully",
            data: result
        });
    } catch (err) {
        console.error("Error fetching time entries for from and to date with Fetched Successfully:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Error fetching time entries for from and to date with Fetched Successfully"
        });
    }


}
module.exports = {
    handleGetTimeEntryWithDate,
    handleSheetDataByNameAndDate
}
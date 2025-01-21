const catalyst = require('zcatalyst-sdk-node');
const { sendErrorResponse } = require('../utils/error');

async function handleGetTimeEntryWithDate(req, res) {
    const catalystApp = catalyst.initialize(req);
    const { fromDate, toDate } = req.query;

    try {
        const result = await getTimeEntryWithDate(catalystApp, fromDate,toDate );
        console.log(result)
         
        if (!result) {
            throw new Error('No data received from database for From and to date time Entry');
        }

        res.status(200).json({
            status: "success",
            message: "Time Entries for from and to date Fetched Successfully",
            data: timeEntries
        });
    } catch (err) {
        console.error("Error fetching time entries for from and to date Fetched Successfully:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Error fetching time entries for from and to date Fetched Successfully"
        });
    }

    try {
        const query = `
          SELECT * 
          FROM timeEntries 
          WHERE date BETWEEN ? AND ?
        `;
    
        const [rows] = await pool.execute(query, [fromDate, toDate]);
        res.json(rows);
      } catch (error) {
        console.error("Error fetching time entries:", error);
        res.status(500).json({ error: "Internal server error" });
      }

}


async function getTimeEntryWithDate(catalystApp) {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT * FROM timeEntries`;
            console.log('Executing time entries query:', query);

            catalystApp.zcql().executeZCQLQuery(query)
                .then(queryResponse => {
                    console.log('Time entries fetched:', queryResponse);
                    resolve(queryResponse);
                })
                .catch(err => {
                    console.error('Database error:', err);
                    reject(new Error(`Database query failed: ${err.message}`));
                });
        } catch (error) {
            console.error('Error in getTimeEntry:', error);
            reject(error);
        }

        try {
            const query = `
              SELECT * 
              FROM time_entries 
              WHERE date BETWEEN ? AND ?
            `;
            console.log("Executing time entry with from and to date", query);
            catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                console.log('Time entries fetched with From and to date:', queryResponse);
                resolve(queryResponse);
            }) .catch(err => {
                console.error('Database error to fetch time entry with from and to date:', err);
                reject(new Error(`Database query failed for from and to date: ${err.message}`));
            });
        } catch (error) {
            console.error("Error fetching time entries for from and to date:", error);
            res.status(500).json({ error: "Internal server error in from and to date" });
          }
    
    });
}
module.exports = {
    handleGetTimeEntryWithDate
}
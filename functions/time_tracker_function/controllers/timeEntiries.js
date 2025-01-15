const catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error')


async function handleTimeEntry(req, res) {
    const catalystApp = catalyst.initialize(req);
    try {
        const {empName, entryType, trainingType, Assignment, liveSession, Hours, Notes, email, entryDate} = req.body;
      
      
        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "email is required"
            });
        }

        console.log('Received time entry data:', {
            empName,
            entryType,
            trainingType,
            Assignment,
            liveSession,
            Hours,
            Notes,
            email,
            entryDate
        });

      
        const result = await addTimeEntry(catalystApp, {
            empName,
            entryType,
            trainingType,
            Assignment,
            liveSession,
            Hours,
            Notes,
            email,
            entryDate
        });

        console.log("Time Entry Inserted Successfully:", result);
        res.status(200).json({
            status: "success",
            message: "Time Entry Inserted Successfully",
            data: result
        });
    } catch (err) {
        console.error("Error inserting time entry:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Failed to insert time entry",
            error: err
        });
    }
}

function addTimeEntry(catalystApp, {empName, entryType, trainingType, Assignment, liveSession, Hours, Notes, email, entryDate}) {
    return new Promise((resolve, reject) => {
        try {
            // Add validation
            if (!email) {
                reject(new Error('email is required'));
                return;
            }
            
            const query = `
                INSERT INTO timeEntries 
                (empName, entryType, trainingType, Assignment, liveSession, Hours, Notes, email, entryDate) 
                VALUES 
                ('${empName}', 
                '${entryType}', 
                '${trainingType}', 
                '${Assignment}', 
                '${liveSession}', 
                '${Hours}', 
                '${Notes}',
                '${email}',
                '${entryDate}')
            `;

            console.log('Executing SQL query:', query);

            catalystApp.zcql().executeZCQLQuery(query)
                .then(queryResponse => {
                    console.log('Insert response:', queryResponse);
                    resolve(queryResponse);
                })
                .catch(err => {
                    console.error('Database error:', err);
                    reject(new Error(`Database insert failed: ${err.message}`));
                });
        } catch (error) {
            console.error('Error in addTimeEntry:', error);
            reject(error);
        }
    });
}

async function handleGetTimeEntry(req, res) {
    const catalystApp = catalyst.initialize(req);
    const { email } = req.query;

    try {
        let timeEntries;
        if (email) {
            timeEntries = await getTimeEntriesByEmail(catalystApp, email);
        } else {
            timeEntries = await getTimeEntry(catalystApp);
        }

        console.log("Time Entries Fetched Successfully:", timeEntries);
        
        if (!timeEntries) {
            throw new Error('No data received from database');
        }

        res.status(200).json({
            status: "success",
            message: "Time Entries Fetched Successfully",
            data: timeEntries
        });
    } catch (err) {
        console.error("Error fetching time entries:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Error fetching time entries"
        });
    }
}

async function getTimeEntry(catalystApp) {
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
    });
}


async function getTimeEntriesByEmail(catalystApp, email) {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT * FROM timeEntries WHERE email = '${email}'`;
            console.log('Executing time entries by email query:', query);

            catalystApp.zcql().executeZCQLQuery(query)
                .then(queryResponse => {
                    console.log('Time entries fetched for email:', email, queryResponse);
                    resolve(queryResponse);
                })
                .catch(err => {
                    console.error('Database error:', err);
                    reject(new Error(`Database query failed: ${err.message}`));
                });
        } catch (error) {
            console.error('Error in getTimeEntriesByEmail:', error);
            reject(error);
        }
    });
}

//Get Time Entries by Id

async function handleGetTimeEntryById(req, res) {
    const id = req.query.id;
    const catalystApp = catalyst.initialize(req);
    await getTimeEntryById(catalystApp,id)
        .then(resp => {
            console.log("Time Entry by Id Fetched Successfully:", resp);
            res.send({
                message: "Time Entry by Id Fetched Successfully:",
                response: "Positive"
            }) 
        })
        .catch(err => {
            console.error(err);
             sendErrorResponse(res);
        }); 
}

function getTimeEntryById(catalystApp, id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM timeEntries WHERE  userId='${id}'`;
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                resolve(queryResponse);
            })
            .catch(err => {
                reject(err);
            });
    });
}


async function handleGetTimeEntryByDate(req, res) {
    const date = req.query.date; 
    const catalystApp = catalyst.initialize(req);

    await getTimeEntryByDate(catalystApp, date)
        .then(resp => {
            console.log("Time Entry by Date Fetched Successfully:", resp);
            if (resp.length === 0) {
                return res.status(404).send({ message: "No entries found for this date" });
            }
            res.send({
                message: "Time Entry by Date Fetched Successfully",
                data: resp,
            });
        })
        .catch(err => {
            console.error("Error fetching time entries by date:", err);
            sendErrorResponse(res);
        });
}

function getTimeEntryByDate(catalystApp, date) {
    return new Promise((resolve, reject) => {
        const query = `
             SELECT * FROM timeEntries 
            WHERE entryDate = '${date}'`; 
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                resolve(queryResponse);
            })
            .catch(err => {
                reject(err);
            });
    });
}


async function handleGetTimeEntryByName(req, res) {
    const name = req.query.name; 
    const catalystApp = catalyst.initialize(req);

    await getTimeEntryByName(catalystApp, name)
        .then(resp => {
            console.log("Time Entry by Name Fetched Successfully:", resp);
            if (resp.length === 0) {
                return res.status(404).send({ message: "No entries found for this Name" });
            }
            res.send({
                message: "Time Entry by Name Fetched Successfully",
                data: resp,
            });
        })
        .catch(err => {
            console.error("Error fetching time entries by Name:", err);
            sendErrorResponse(res);
        });
}

function getTimeEntryByName(catalystApp, name) {
    return new Promise((resolve, reject) => {
        const query = `
             SELECT * FROM timeEntries 
            WHERE empName = '${name}'`; 
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                resolve(queryResponse);
            })
            .catch(err => {
                reject(err);
            });
    });
}


// function updateTimeEntry(catalystApp, data, rowId) {
//     return new Promise((resolve, reject) => {
//         try {
//             // Validate the Hours format
//             if (!data.Hours || !data.Hours.match(/^\d{2}:\d{2}:\d{2}$/)) {
//                 reject(new Error('Invalid Hours format. Expected HH:MM:SS'));
//                 return;
//             }

//             // Create a proper datetime string for the Hours field
//             const currentDate = new Date().toISOString().split('T')[0];
//             const dateTimeHours = `${currentDate}T${data.Hours}Z`;

//             const query = `
//             UPDATE timeEntries
//             SET 
//                 empName = '${data.empName}', 
//                 entryType = '${data.entryType}', 
//                 trainingType = '${data.trainingType}', 
//                 Assignment = '${data.Assignment}', 
//                 liveSession = '${data.liveSession}', 
//                 Hours = DATETIME '${dateTimeHours}', 
//                 Notes = '${data.Notes}', 
//                 email = '${data.email}', 
//                 entryDate = '${data.entryDate}'
//             WHERE ROWID = '${rowId}'`;

//             console.log('Executing update query:', query);

//             catalystApp.zcql().executeZCQLQuery(query)
//                 .then(queryResponse => {
//                     resolve(queryResponse);
//                 })
//                 .catch(err => {
//                     console.error('Database error:', err);
//                     reject(err);
//                 });
//         } catch (error) {
//             console.error('Error in updateTimeEntry:', error);
//             reject(error);
//         }
//     });
// }

/********************************** Handle Update Time Entry *************************************/ 


async function handleUpdateTimeEntry(req, res) {
    try {
        const rowId = req.query.ROWID;
        if (!rowId) {
            return res.status(400).json({
                status: "error",
                message: "ROWID is required"
            });
        }

        const updateData = {
            empName: req.body.empName || '',
            entryType: req.body.entryType || '',
            trainingType: req.body.trainingType || '',
            Assignment: req.body.Assignment || '',
            liveSession: req.body.liveSession || '',
            Hours: req.body.Hours || '00:00:00',
            Notes: req.body.Notes || '',
            email: req.body.email || '',
            entryDate: req.body.entryDate || new Date().toISOString().split('T')[0]
        };

        console.log("Row Id for update", rowId);
        console.log('Received time entry data:', updateData);

        const catalystApp = catalyst.initialize(req);
        const result = await updateTimeEntry(catalystApp, updateData, rowId);

        console.log("Time Entry Updated Successfully:", result);
        res.status(200).json({
            status: "success",
            message: "Time Entry Updated Successfully",
            data: result
        });
    } catch (err) {
        console.error("Error Updating time entry:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Failed to update time entry",
            error: err
        });
    }
}

function updateTimeEntry(catalystApp, data, rowId) {
    return new Promise((resolve, reject) => {
        try {
            const query = `
            UPDATE timeEntries
            SET 
                empName = '${data.empName}', 
                entryType = '${data.entryType}', 
                trainingType = '${data.trainingType}', 
                Assignment = '${data.Assignment}', 
                liveSession = '${data.liveSession}', 
                Hours ='${data.Hours}', 
                Notes = '${data.Notes}', 
                email = '${data.email}', 
                entryDate = '${data.entryDate}'
            WHERE ROWID = '${rowId}'`;

            console.log('Executing update query:', query);

            catalystApp.zcql().executeZCQLQuery(query)
                .then(queryResponse => {
                    resolve(queryResponse);
                })
                .catch(err => {
                    console.error('Database error:', err);
                    reject(err);
                });
        } catch (error) {
            console.error('Error in updateTimeEntry:', error);
            reject(error);
        }
    });
}



module.exports = {
    handleTimeEntry, 
    handleGetTimeEntry, 
    handleGetTimeEntryById, 
    handleGetTimeEntryByDate,
    handleGetTimeEntryByName,
    getTimeEntry,
    getTimeEntriesByEmail,
    handleUpdateTimeEntry
}


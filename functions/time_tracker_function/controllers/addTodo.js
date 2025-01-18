function addTodo(catalystApp, email, todo, date) {
    return new Promise((resolve, reject) => {
 
        const checkQuery = `SELECT * FROM Users WHERE EMAIL = '${email}'`;
        
        console.log('Checking for existing user:', checkQuery);
        
        catalystApp.zcql().executeZCQLQuery(checkQuery)
            .then(existingUser => {
                if (existingUser && existingUser.length > 0) {
                    reject(new Error('User with this email already exists'));
                    return;
                }

               
                const query = `
                    INSERT INTO todos
                    (email, todo, date) 
                    VALUES 
                    ('${email}', '${todo}', '${date}')
                `;

                console.log('Inserting new todo:', query);
                return catalystApp.zcql().executeZCQLQuery(query);
            })
            .then(queryResponse => {
                console.log('Todo added successfully:', queryResponse);
                resolve(queryResponse);
            })
            .catch(err => {
                console.error('Database error:', err);
                reject(err);
            });
    });
}


async function handleAddTodo(req, res) {
    const { email } = req.body;

    
    const catalystApp = catalyst.initialize(req);

    try {
        const result = await addTodo(catalystApp, email, todo, date );

        res.status(200).json({
            status: "success",
            message: "Todo added successfully.",
            data: result,
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Failed to add todo"
        });
    }
}

module.exports = {
    handleAddTodo
} 

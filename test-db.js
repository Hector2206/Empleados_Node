const db = require('./config/database');

db.query("SELECT id, username FROM users")
    .then(rows => {
        console.log("USERS FROM NODE:", rows);
        process.exit();
    })
    .catch(err => {
        console.log("ERROR:", err);
        process.exit();
    });

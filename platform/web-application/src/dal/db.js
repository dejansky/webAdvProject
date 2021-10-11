const mysql = require('mysql');

const connect = mysql.createConnection({
    host: 'database',
    user: 'root',
    password: 'password',
    database: 'myDB'
});

module.exports = connect
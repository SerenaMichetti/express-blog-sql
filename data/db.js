const mysql = require('mysql2');

const dbConfiguration= {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog_db'
}
const connection  = mysql.createConnection(dbConfiguration);

connection.connect(error => {
    if(error) throw error;

    console.log('Connessione avvenuta con successo');
})

module.exports = connection;
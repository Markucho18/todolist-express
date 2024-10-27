const mysql = require("mysql2")

const db = mysql.createConnection({
  'host': 'localhost',
  'user': 'root',
  'password': 'RutPaswor321',
  'database': 'todolist_app'
})

db.connect((err) => {
  if(err){
    console.log("There was an error connectinc to database: ", err)
  }
  else{
    console.log("Connection to database succesfully done")
  }
})

module.exports = db
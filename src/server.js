require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const PORT = process.env.PORT || 3000

const db = require("./db")

app.use(cors())

app.use(express.json())

const tasksRouter = require("./routes/tasks.js")
app.use("/tasks", tasksRouter)
const usersRouter = require("./routes/users.js")
app.use("/users", usersRouter)

app.get('/', (req, res) => {
  res.send('¡Hola desde Express!');
});

app.get("/sql/:table", (req, res)=>{
  const {table} = req.params
  const query = `SELECT * FROM ${table}`
  db.query(query, (err, results)=>{
    if(err){
      res.json({
        msg:"There was an error",
        error: err,
      })
    }
    else if(results){
      res.json({
        msg:`Here's the ${table} table: `,
        results
      })
    }
  })
  db.end()
})

app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`)
})
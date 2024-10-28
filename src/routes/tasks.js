const express = require("express")
const router = express.Router()
const db = require("../db")

const createInsertQuery = require("../utils/createInsertQuery")
const createUpdateQuery = require("../utils/createUpdateQuery")
const verifyToken = require("../utils/verifyToken")

router.use(verifyToken)

const subTasksRouter = require("./subTasks")
router.use("/subTask", subTasksRouter)

const dateRouter = require("./date")
router.use("/date", dateRouter)

/* {
  "user_id": 2,
  "task_title": "Estudiar chino mandarin",
  "task_deadline": "2024-10-27",
  "task_priority": 3,
  "task_description": "Con mi cuaderno de hojas de bambu"
} */

router.get("/", (req, res)=>{
  const query = 'SELECT * FROM tasks'
  db.query(query, (err, results)=>{
    if(err) res.json({ msg:"There was an error", error: err })
    else if(results) res.json({msg:`Here's the tasks table: `, results})
  })
})

router.get("/:id", (req, res)=>{
  console.log("Se hizo una consulta a tasks/id")
  const {id} = req.params
  const query = 'SELECT * FROM tasks WHERE task_id = ?'
  db.query(query, id, (err, results)=>{
    if(err) res.json({ msg:"There was an error", error: err })
    else if(results) res.json({ msg:"Tasks coincidence by id", results})
  })
})

router.post("/", (req, res)=>{
  const {query, values} = createInsertQuery("tasks", {...req.body, user_id: req.user_id})
  db.query(query, values, (err, results)=>{
    if(err) res.json({msg: "There was an error!", error: err})
    else if(results) res.json({msg: "Task created succesfully ", results})
  })
})

router.put("/:id", (req, res)=>{
  const {query, queryValues} = createUpdateQuery("tasks", req.params.id, req.body, req.user_id)
  console.log({queryValues, query})
  db.query(query, queryValues, (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/PUT: ", error})
    else if(results) res.json({msg: "Resultados en task/PUT: ", results})
  })
})

router.delete("/:id", (req, res)=>{
  const {id} = req.params
  const query = `DELETE FROM tasks WHERE task_id = ? AND user_id = ?`
  db.query(query, [id, req.user_id], (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/DELETE: ", error})
    else if (results.affectedRows === 0) res.json({ msg: "No se encontró una tarea con ese ID." });
    else res.json({ msg: "Tarea eliminada exitosamente.", results })
  })
})

module.exports = router
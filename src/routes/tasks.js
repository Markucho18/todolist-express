const express = require("express")
const router = express.Router()
const db = require("../db")

const createInsertQuery = require("../createInsertQuery")
const createUpdateQuery = require("../createUpdateQuery")

router.get("/", (req, res)=>{
  const query = 'SELECT * FROM tasks'
  db.query(query, (err, results)=>{
    if(err) res.json({ msg:"There was an error", error: err })
    else if(results) res.json({msg:`Here's the tasks table: `, results})
  })
})

router.get("/subTask", (req, res)=>{
  //Checkear si una tarea es hija de otra
  const { child_task_id, parent_task_id } = req.body
  const values = [child_task_id, parent_task_id]
  const query = "SELECT * FROM sub_tasks WHERE child_task_id = ? AND parent_task_id = ?"
  db.query(query, values, (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/GET/subTask: ", error})
    else if(results.length > 0) res.json({msg: `La tarea ${values[0]} es hija de la tarea ${values[1]}`, results})
    else res.json({msg: `La tarea ${values[0]} NO ES hija de la tarea ${values[1]}`, results})
  })
})

router.post("/subTask", (req, res) => {
  // keys: child_task_id and parent_task_id
  const {query, values} = createInsertQuery("sub_tasks", req.body)
  db.query(query, values, (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/POST/subTask: ", error})
    else if(results) res.json({msg: "Resultados en task/POST/subTask: ", results})
  })
})

router.delete("/subTask", (req, res)=>{
  // keys: child_task_id and parent_task_id
  const { child_task_id, parent_task_id } = req.body
  const values = [child_task_id, parent_task_id]
  const query = "DELETE FROM sub_tasks WHERE child_task_id = ? AND parent_task_id = ?"
  db.query(query, values, (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/DELETE/subTask: ", error})
    else if(results.length > 0) res.json({msg: `Se elimino la subtarea ${child_task_id}`, results})
    else res.json({msg: `No se encontro la subtarea ${child_task_id}`, results})
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
  const {query, values} = createInsertQuery("tasks", req.body)
  db.query(query, values, (err, results)=>{
    if(err) res.json({msg: "There was an error!", error: err})
    else if(results) res.json({msg: "Task created succesfully ", results})
  })
})

router.put("/:id", (req, res)=>{
  const {query, queryValues} = createUpdateQuery("tasks", req.params.id, req.body)
  console.log({queryValues, query})
  db.query(query, queryValues, (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/PUT: ", error})
    else if(results) res.json({msg: "Resultados en task/PUT: ", results})
  })
})

router.delete("/:id", (req, res)=>{
  const {id} = req.params
  const query = `DELETE FROM tasks WHERE task_id = ?`
  db.query(query, [id], (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/DELETE: ", error})
    else if (results.affectedRows === 0) res.json({ msg: "No se encontró una tarea con ese ID." });
    else res.json({ msg: "Tarea eliminada exitosamente.", results })
  })
})

module.exports = router
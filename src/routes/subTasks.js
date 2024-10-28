const express = require("express")
const router = express.Router()
const db = require("../db")

const createInsertQuery = require("../createInsertQuery")

router.get("/", (req, res)=>{
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

router.post("/", (req, res) => {
  // keys: child_task_id and parent_task_id
  const {query, values} = createInsertQuery("sub_tasks", req.body)
  db.query(query, values, (error, results)=>{
    if(error) res.json({msg: "Hubo un error en task/POST/subTask: ", error})
    else if(results) res.json({msg: "Resultados en task/POST/subTask: ", results})
  })
})

router.delete("/", (req, res)=>{
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

module.exports = router
const express = require("express")
const router = express.Router()
const db = require("../db")

const createInsertQuery = require("../utils/createInsertQuery")

router.post("/check", async (req, res)=>{
  //Checkear si una tarea es hija de otra
  const { child_task_id, parent_task_id } = req.body
  const values = [child_task_id, parent_task_id]
  const query = "SELECT * FROM sub_tasks WHERE child_task_id = ? AND parent_task_id = ?"
  try{
    const [rows] = await pool.query(query)
    if(rows.length === 0) res.status(204).json({msg: `La tarea ${child_task_id} NO es hija de ${parent_task_id}`, results: rows}) 
    req.status(200).json({ msg:`La tarea ${child_task_id} es hija de ${parent_task_id}`, results: rows})
  } catch(error){
    res.json({msg: "Error en tasks/subTasks/POST/check", error})
  }
})

router.post("/create", async (req, res) => {
  // keys: child_task_id and parent_task_id
  const {query, values} = createInsertQuery("sub_tasks", req.body)
  try{
    const results = await pool.query(query, values)
    if(results.affectedRows === 0) res.status(204).json({msg: `La subtarea no pudo ser creada`, results}) 
    req.status(200).json({ msg:`Subtarea creda exitosamente`, results})
  } catch(error){
    res.json({msg: "Error en tasks/subTasks/POST/create", error})
  }
})

router.delete("/", async (req, res)=>{
  // keys: child_task_id and parent_task_id
  const { child_task_id, parent_task_id } = req.body
  const values = [child_task_id, parent_task_id]
  const query = "DELETE FROM sub_tasks WHERE child_task_id = ? AND parent_task_id = ?"
  try{
    const results = await pool.query(query, values)
    if(results.affectedRows === 0) res.status(204).json({msg: `La tarea no fue encontrada`, results}) 
    req.status(200).json({ msg:`Subtarea eliminada exitosamente`, results})
  } catch(error){
    res.json({msg: "Error en tasks/subTasks/DELETE/", error})
  }
})

module.exports = router
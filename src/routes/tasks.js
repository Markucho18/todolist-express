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

router.get("/", async (req, res)=>{
  const query = 'SELECT * FROM tasks'
  try{
    const [rows] = await pool.query(query)
    if(rows.length === 0) res.status(204).json({msg: "No hay nada en la tabla tasks xd", results: rows}) 
    req.status(200).json({ msg: "Resultados encontrados en tabla tasks", results: rows})
  } catch(error){
    res.json({msg: "Error en tasks/get", error})
  }
})

router.get("/:id", async (req, res)=>{
  const {id} = req.params
  const query = 'SELECT * FROM tasks WHERE task_id = ?'
  try{
    const [rows] = await pool.query(query, [id])
    if(rows.length === 0) res.status(204).json({msg: "No se encontro la tarea", results: rows}) 
    req.status(200).json({ msg: "Tarea encontrada exitosamente", results: rows})
  } catch(error){
    res.json({msg: "Error en tasks/get/:id", error})
  }
})

router.post("/", async (req, res)=>{
  const {query, values} = createInsertQuery("tasks", {...req.body, user_id: req.user_id})
  try{
    const results = await pool.query(query, values)
    //if( === 0) res.status(204).json({msg: "No hay nada en la tabla tasks xd", results: rows}) 
    req.status(200).json({ msg: "Tarea creada exitosamente", results})
  } catch(error){
    res.json({msg: "Error en tasks/POST/", error})
  }
})

router.put("/:id", async (req, res)=>{
  const {query, queryValues} = createUpdateQuery("tasks", req.params.id, req.body, req.user_id)
  try{
    const results = await pool.query(query, queryValues)
    if(results.affectedRows === 0) res.status(204).json({msg: "No se encontro una tarea con ese id", results}) 
    req.status(200).json({ msg: "Tarea actualizada exitosamente", results})
  } catch(error){
    res.json({msg: "Error en tasks/PUT/:id", error})
  }
})

router.delete("/:id", async (req, res)=>{
  const {id} = req.params
  const query = `DELETE FROM tasks WHERE task_id = ? AND user_id = ?`
  try{
    const results = await pool.query(query, [id, req.user_id])
    if(results.affectedRows === 0) res.status(204).json({msg: "No se encontro una tarea con esas caracteristicas", results}) 
    req.status(200).json({ msg: "Tarea eliminada correctamente", results})
  } catch(error){
    res.json({msg: "Error en tasks/DELETE/:id", error})
  }
})

module.exports = router
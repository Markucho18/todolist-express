const express = require("express")
const db = require("../db")
const router = express.Router()

//No date tasks
router.get("/", (req, res)=>{
  console.log("Consulta a noDate")
  const query = "SELECT * FROM tasks WHERE task_deadline IS NULL AND user_id = ?"
  db.query(query, [req.user_id], (error, results)=>{
    if(error) res.json({ msg: "There was an error in tasks/date/GET/noDate", error})
    else if(results.length > 0) res.json({ msg: "Results were found tasks/date/GET/noDate", results})
    else res.json({ msg: "NO results were found tasks/date/GET/noDate", results})
  })
})

router.get("/week", (req, res)=>{
  const query = `
    SELECT * FROM tasks 
    WHERE YEAR(task_deadline) = YEAR(CURDATE()) 
    AND WEEK(task_deadline) = WEEK(CURDATE())
    AND user_id = ?`
  db.query(query, [req.user_id], (error, results)=>{
    if(error) res.json({ msg: "There was an error in tasks/date/GET/week", error})
    else if(results.length > 0) res.json({ msg: "Results were found tasks/date/GET/week", results})
    else res.json({ msg: "NO results were found tasks/date/GET/week", results})
  })
})

router.get("/month", (req, res)=>{
  const query = `
    SELECT * FROM tasks 
    WHERE YEAR(task_deadline) = YEAR(CURDATE()) 
    AND MONTH(task_deadline) = MONTH(CURDATE())
    AND user_id = ?`
  db.query(query, [req.user_id], (error, results)=>{
    if(error) res.json({ msg: "There was an error in tasks/date/GET/month", error})
    else if(results.length > 0) res.json({ msg: "Results were found tasks/date/GET/month", results})
    else res.json({ msg: "NO results were found tasks/date/GET/month", results})
  })
})

router.get("/:date", (req, res)=>{
  const {date} = req.params
  const query = "SELECT * FROM tasks WHERE task_deadline = ? AND user_id = ?"
  db.query(query, [date, req.user_id], (error, results)=>{
    if(error) res.json({ msg: "There was an error in tasks/date/GET/:date", error})
    else if(results.length > 0) res.json({ msg: "Results were found tasks/date/GET/:date", results})
    else res.json({ msg: "NO results were found tasks/date/GET/:date", results})
  })
})

module.exports = router
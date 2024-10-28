const express = require("express")
const db = require("../db")
const router = express.Router()

router.get("/:date", (req, res)=>{
  const {user_id} = req.body
  const {date} = req.params
  const query = "SELECT * FROM tasks WHERE task_deadline = ? AND user_id = ?"
  db.query(query, [date, user_id], (error, results)=>{
    if(error) res.json({ msg: "There was an error in tasks/date/GET/:date", error})
    else if(results.length > 0) res.json({ msg: "Results were found tasks/date/GET/:date", results})
    else res.json({ msg: "NO results were found tasks/date/GET/:date", results})
  })
})

router.get("/noDate", (req, res)=>{
  console.log("Consulta a noDate")
  const {user_id} = req.params
  const query = "SELECT * FROM tasks WHERE task_deadline IS NULL AND user_id = ?"
  db.query(query, [user_id], (error, results)=>{
    if(error) res.json({ msg: "There was an error in tasks/date/GET/noDate", error})
    else if(results.length > 0) res.json({ msg: "Results were found tasks/date/GET/noDate", results})
    else res.json({ msg: "NO results were found tasks/date/GET/noDate", results})
  })
})

module.exports = router
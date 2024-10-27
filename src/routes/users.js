const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", (req, res)=>{
  const query = 'SELECT * FROM users'
  db.query(query, (err, results)=>{
    if(err){
      res.json({
        msg:"There was an error",
        error: err,
      })
    }
    else if(results){
      res.json({
        msg:`Here's the users table: `,
        results
      })
    }
  })

})

router.get("/:id", (req, res)=>{
  console.log("Se hizo una consulta a users/id")
  const {id} = req.params
  const query = 'SELECT * FROM users WHERE id = ?'
  db.query(query, id, (err, results)=>{
    if(err){
      res.json({
          msg:"There was an error",
          error: err,
        })}
    else if(results){
      res.json({
        msg:`User_id coincidence: `,
        results
      })
    }
  })
})

//Crear usuario
//Editar y eliminar (opcional)
//Encriptar contraseña
//Crear y manejar token
//Validar usuario para acceder a las tareas

module.exports = router
const express = require("express")
const router = express.Router()
const db = require("../db")
const jwt = require("jsonwebtoken")
const secretKey = process.env.JWTSECRETKEY

const createInsertQuery = require("../utils/createInsertQuery")
const createUpdateQuery = require("../utils/createUpdateQuery")

const { encryptPassword, comparePasswords } = require("../utils/passwordAuth")

const pictureRouter = require("./picture")
router.use("/picture", pictureRouter)

router.get("/", (req, res)=>{
  const query = 'SELECT * FROM users'
  db.query(query, (err, results)=>{
    if(err) res.json({ msg:"There was an error", error: err })
    else if(results) res.json({ msg:`Here's the users table: `, results })
  })
})

router.get("/login", (req, res) => {
  const { email, user_password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (error, results) => {
    if (error) return res.json({ msg: "There was an error", error })
    if (results.length === 0) return res.json({ msg: "The user doesn't exist", userIsValid: false })
    const hashedPassword = results[0].user_password;
    const passwordIsValid = await comparePasswords(user_password, hashedPassword);
    if (passwordIsValid) {
      const token = await jwt.sign({user_id: results[0].id}, secretKey, {expiresIn: '1h'})
      res.json({ msg: "The email and password are valid", userIsValid: true, token});
    } else {
      res.json({ msg: "The password is not valid", userIsValid: false });
    }
  });
});


router.get("/:id", (req, res)=>{
  console.log("Se hizo una consulta a users/id")
  const {id} = req.params
  const query = 'SELECT * FROM users WHERE id = ?'
  db.query(query, id, (err, results)=>{
    if(err) res.json({ msg:"There was an error", error: err })
    else if(results) res.json({ msg:`User_id coincidence: `, results })
  })
})

router.post("/", async (req, res)=>{
  const {username, email, user_password} = req.body
  const encryptedPassword = await encryptPassword(user_password)
  const defaultImageUrl = "https://res.cloudinary.com/dyihwozea/image/upload/byrmbj7rdtui1ohypvxm.webp"
  const {query, values} = createInsertQuery("users", {username, email, user_password: encryptedPassword, profile_pic: defaultImageUrl})
  db.query(query, values, (error, results)=>{
    if(error) res.json({ msg:"There was an error in users/POST", error })
    else if(results) res.json({ msg:`User ${username} created successfully`, results })
  })
})

router.put("/:id",(req, res)=>{
  const {query, queryValues} = createUpdateQuery("users", req.params.id, req.body)
  console.log({queryValues, query})
  db.query(query, queryValues, (error, results)=>{
    if(error) res.json({msg: "Hubo un error en users/PUT: ", error})
    else if(results) res.json({msg: "Resultados en users/PUT: ", results})
  })
})

router.delete("/:id", (req, res)=>{
  const {id} = req.params
  const query = `DELETE FROM users WHERE id = ?`
  db.query(query, [id], (error, results)=>{
    if(error) res.json({msg: "Hubo un error en users/DELETE: ", error})
    else if (results.affectedRows === 0) res.json({ msg: "No se encontró un usuario con ese ID." });
    else res.json({ msg: "Usuario eliminado exitosamente.", results })
  })
})




//Crear usuario
//Editar y eliminar (opcional)
//Encriptar contraseña
//Crear y manejar token
//Meter token en cookie y devolver
//Almacenar imagen en cloudinary
//Acceder a la imagen(creo q eso es mas frontend mas que nada)
//Validar usuario para acceder a las tareas

module.exports = router
const express = require("express")
const router = express.Router()
const pool = require("../db")
const jwt = require("jsonwebtoken")
const secretKey = process.env.JWTSECRETKEY

const createInsertQuery = require("../utils/createInsertQuery")
const createUpdateQuery = require("../utils/createUpdateQuery")

const { encryptPassword, comparePasswords } = require("../utils/passwordAuth")

const pictureRouter = require("./picture")
const verifyToken = require("../utils/verifyToken")
router.use("/picture", pictureRouter)

router.get("/", async (req, res)=>{
  const query = 'SELECT * FROM users'
  try{
    const [rows] = await pool.query(query)
    if(rows.length === 0) res.status(204).json({msg: "No fueron encontrados usuarios", results: rows})
    res.status(200).json({ msg: "Usuarios encontrados en la tabla", results: rows})
  } catch(error){
    res.json({msg: "Ocurrio un error", error})
  }
})

router.post("/login", async (req, res) => {
  console.log("Consulta en users/login");
  const { email, user_password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";
  try {
    const [results] = await pool.query(query, [email]); // Usa await para esperar el resultado de la consulta
    if (results.length === 0) return res.status(404).json({ msg: "El usuario no existe", notValid: "email" })
    const hashedPassword = results[0].user_password;
    const passwordIsValid = await comparePasswords(user_password, hashedPassword);
    if (passwordIsValid) {
      const token = await jwt.sign({ user_id: results[0].id }, secretKey, { expiresIn: '1h' });
      return res.json({ msg: "El email y la contraseña son válidos", token });
    } else {
      return res.json({ msg: "La contraseña no es válida", notValid: "password" });
    }
  } catch (error) {
    console.error("Hubo un error en users/login:", error);
    return res.status(500).json({ msg: "Hubo un error", error });
  }
});


router.post("/token", verifyToken, (req, res)=>{
  if(req.user_id){
    res.json({ msg:"Token validado", tokenIsValid: true })
  }
  else res.json({ msg: "Token no valido", tokenIsValid: false })
})

router.get("/:id", async (req, res)=>{
  console.log("Se hizo una consulta a users/id")
  const {id} = req.params
  const query = 'SELECT * FROM users WHERE id = ?'
  try{
    const [rows] = await pool.query(query, [id])
    if(rows.length === 0) return res.json({msg: "No se encontro ese usuario", results: rows}) 
    res.json({ msg: "Usuario encontrado exitosamente", results: rows})
  } catch(error){
    res.json({msg: "Hubo un error en users/GET/:id", error})
  }
})

const checkData = async (req, res, next) => {
  const {email} = req.body
  const query = "SELECT * FROM users WHERE email = ?"
  try{
    const [rows] = await pool.query(query, [email])
    if(rows.length > 0) return res.json({ msg: "El email ya esta en uso", results: rows, emailInUse: true})
    next()
  } catch(error){
    res.json({ msg: "Hubo un error en checkData()", error})
  }
}

router.post("/", checkData, async (req, res)=>{
  const {username, email, user_password} = req.body
  const encryptedPassword = await encryptPassword(user_password)
  const defaultImageUrl = "https://res.cloudinary.com/dyihwozea/image/upload/byrmbj7rdtui1ohypvxm.webp"
  const {query, values} = createInsertQuery("users", {username, email, user_password: encryptedPassword, profile_pic: defaultImageUrl})
  try {
    const results = await pool.query(query, values);
    if(results.affectedRows === 0) return res.json({ msg: "users/POST no se ejecuto correctamente"})
    res.json({ msg: `User ${username} created successfully`, results});
  } catch (error) {
    res.status(500).json({ msg: "There was an error in users/POST", error });
  }
})

router.put("/:id", async (req, res)=>{
  console.log(req.body)
  const {query, queryValues} = createUpdateQuery("users", req.params.id, req.body)
  try{
    const [rows] = await pool.query(query, queryValues)
    if(rows.length === 0) return res.json({ msg: "Usuario no encontrado"})
    res.json({ msg: "Usuario editado correctamente", results})
  } catch(error){
    res.json({ msg: "Error en users/PUT/:id: ", error})
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM users WHERE id = ?`;
  try {
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) return res.json({ msg: "No se encontró un usuario con ese ID." });
    res.json({ msg: "Usuario eliminado exitosamente.", results });
  } catch (error) {
    res.json({ msg: "Hubo un error en users/DELETE: ", error });
  }
});


//Crear usuario
//Editar y eliminar (opcional)
//Encriptar contraseña
//Crear y manejar token
//Meter token en cookie y devolver
//Almacenar imagen en cloudinary
//Acceder a la imagen(creo q eso es mas frontend mas que nada)
//Validar usuario para acceder a las tareas

module.exports = router
const express = require("express")
const router = express.Router()
const db = require("../db")
const path = require("path");
const fs = require("fs")
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const verifyToken = require("../utils/verifyToken")

const MAX_SIZE = 2 * 1024 * 1024;

const upload = multer({
  dest: "../uploads", // Carpeta temporal para almacenar las imágenes subidas
  limits: {
    fileSize: MAX_SIZE // Limite de tamaño en bytes
  },
  fileFilter: (req, file, cb) => {
    // Puedes agregar un filtro para permitir solo ciertos tipos de archivos, por ejemplo, imágenes
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Solo se permiten imágenes!'));
    }
  }
});


cloudinary.config({
  url: process.env.CLOUDINARY_URL
})

router.use(verifyToken)

router.put("/", upload.single('profile_pic'), async (req, res)=>{
  console.log("CONSULTA EN PUT DE USERS/PICTURE")
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  try{
    const result = await cloudinary.uploader.upload(req.file.path) //La url local que devuelve el middleware upload.single()
    const imageUrl = result.secure_url
    fs.unlinkSync(req.file.path) //Eliminar archivo temporal
    const query = 'UPDATE users SET profile_pic = ? WHERE id = ?'
    const results = await pool.query(query, [imageUrl, req.user_id])
    if(results.affectedRows > 0) res.json({msg: "Imagen actualizada correctamente", results})
  }
  catch(error){
    if (error instanceof multer.MulterError) {
      // Un error de Multer (por ejemplo, tamaño de archivo excedido)
      return res.status(400).json({ msg: error.message });
    } else {
      return res.json({msg: "There was an error in users/picture/POST", error})
    }
  }
})

module.exports = router
import usuariocontrollers from '../controllers/usuariocontrollers.js';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import resultadocontrollers from '../controllers/resultadocontrollers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, "../../uploads");

const router = Router();

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Crear middleware de Multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// Rutas usuario
router.post("/usuario/foto", usuariocontrollers.subirFoto);
router.get("/usuario/usuario", usuariocontrollers.GetUsuario);
router.post("/createusuario", usuariocontrollers.createUsuario);
router.delete("/deleteusuario/:id", usuariocontrollers.deleteUsuario);
router.put("/updateusuario/:id", usuariocontrollers.updateUsuarios);

//Rutas resultados
router.get("/resultados/:id", resultadocontrollers.getResultados);
router.post("/createresultado", resultadocontrollers.createResultado);



export default router;

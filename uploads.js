import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const filename = fileURLToPath(import.meta.url);
const process = dirname(filename);

let date = new Date(); // Fecha actual para generar nombres únicos usando timestamp ashkenaz
let error = new Error("Error al subir el archivo");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.dirname(), 'uploads')); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nombre único para evitar conflictos
  }
});

// Filtro para validar el tipo de archivo (opcional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new error('Tipo de archivo no permitido'), false);
        }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10 MB por archivo
});

export default upload;
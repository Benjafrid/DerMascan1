import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import { config } from 'dotenv';


const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // Carpeta donde se guardarán los archivos
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); //milisegundos actuales y numero random de 1 a 9 ubicados todos
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nombre único para evitar problemas 
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Tipo de archivo no permitido'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10 MB por archivo
});

export const guardarFotoEnDB = async (base64) => {
  const client = new Client(config);

  try {
    await client.connect();

    const result = await client.query(
      'INSERT INTO foto (fotos) VALUES ($1) RETURNING *',
      [base64]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error al guardar la foto en la base de datos:', error.message);
    throw error;
  } finally {
    await client.end();
  }
};


export default upload;
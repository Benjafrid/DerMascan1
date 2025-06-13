import express from 'express';
import cors from 'cors';
import { fileURLToPath } from "url";
import { dirname, join } from 'path';
import usuariorouter from './router/usuariorouter.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, "../uploads");

// Crear carpeta uploads si no existe
//if (!fs.existsSync(uploadDir)) {
  //fs.mkdirSync(uploadDir, { recursive: true });
//}

app.use('/uploads', express.static(uploadDir));
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/usuarios', usuariorouter);

app.get('/', (_, res) => {
  res.send("API WORKING");
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

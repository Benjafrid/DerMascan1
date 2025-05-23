import usuarioController from '../controllers/usuarioController.js';
import { Router } from 'express';
import cors from "cors";

const router = Router();

router.get("/usuario/:usuario", usuarioController.getUsuario);
router.delete("/usuario/:usuario", usuarioController.deleteUsuario);
router.post("/usuario/actualizar", usuarioController.updateUsuario);
router.post("/usuario", usuarioController.createUsuario);

export default router;
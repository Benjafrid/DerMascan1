import usuarioservice from "../services/usuarioservice.js";
import {guardarFotoEnDB} from '../uploads';

const GetUsuario = async (_, res) => {
 try{
    const usuarios = await usuarioservice.getAllUsuario();
    if (!usuarios || usuarios.length === 0) {
        return res.status(404).json({ message: "No se encontraron compradores" });
    }

    console.log("Usuarios obtenidos:", usuarios);
    res.status(200).json({ usuarios, message: 'Obtenidos con éxito' });
} catch (error) {
    console.error("Error en el controlador getAllUsuario:", error.message);
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
}
 };

 const createUsuario = async (req, res) => {
    try {
        const usuario = req.body;
        console.log("Datos del usuario recibido:", usuario);

        // Validación de datos
        if (!usuario.nombre || !usuario.mail || !usuario.password || !usuario.apellido) {
            console.error("Datos de usuario incompletos:", usuario);
            return res.status(400).json({ message: "Datos de usuario incompletos" });
        }

        // Intentar crear el usuario
        const nuevoUsuario = await usuarioservice.createUsuario(usuario);
        console.log("Usuario creado exitosamente:", nuevoUsuario);

        res.status(201).json({ usuario: nuevoUsuario, message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error("Error completo:", error); // Mostrará stack trace
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
      }
 };      
 
 const deleteUsuario = async (req, res) => {


 };

 const updateUsuario = async (req, res) => {

 };


const subirFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se subió ningún archivo" });
        }

        // Obtener información del archivo subido
        const { filename, path: filePath } = req.file;

        const fotoGuardada = await guardarFotoEnDB(filename, filePath);

        // Responder al cliente
        res.status(200).json({
            message: "Foto subida exitosamente",
            file: fotoGuardada
        });
    } catch (error) {
        console.error("Error al subir la foto:", error.message);
        res.status(500).json({ message: "Error al subir la foto", error: error.message });
    }
};

 
export default {
    GetUsuario,
    createUsuario, 
    deleteUsuario,
    updateUsuario,
    createUsuario,
    subirFoto
}
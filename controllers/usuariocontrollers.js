import usuarioservice, { eliminarUsuario } from '../services/usuarioservice.js';
import { guardarFotoEnDB } from '../middlewares/uploads.js';

const GetUsuario = async (_, res) => {
    try {
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
        console.error("Error completo:", error);
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
};

const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
      const usuarioEliminado = await eliminarUsuario(id);
      res.status(200).json({
        message: 'Usuario eliminado correctamente',
        data: usuarioEliminado
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
      res.status(500).json({
        message: "Error al eliminar usuario",
        error: error.message
      });
    }
  };
  
const updateUsuarios = async (req, res) => {
    const { id } = req.params;
    const nuevosDatos = req.body;
  
    try {
      const usuarioActualizado = await usuarioservice.updateUsuario(id, nuevosDatos);
      res.status(200).json({
        message: 'Usuario actualizado correctamente',
        data: usuarioActualizado
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error.message);
      res.status(500).json({
        message: "Error al actualizar usuario",
        error: error.message
      });
    }
  };


  const subirFoto = async (req, res) => {
      try {
          const { fotos, diametro } = req.body;
  
          if (!fotos || !diametro) {
              return res.status(400).json({ message: 'No se proporcionó la foto o el diámetro' });
          }
  
          if (isNaN(diametro)) {
              return res.status(400).json({ message: 'El diámetro debe ser un número válido' });
          }
  
          // Llamada al modelo de IA (Render API)
          const response = await fetch('https://dermascan-api.onrender.com/predict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: fotos, diametro })
          });
  
          const prediction = await response.json();
          
          // Guardar en la base de datos
          const guardado = await guardarFotoEnDB(fotos, diametro);
  
          res.status(200).json({
              message: 'Foto subida y guardada correctamente',
              prediction,
              saved: guardado
          });
  
      } catch (error) {
          console.error("Error al subir la foto:", error.message);
          if (!res.headersSent) {
              return res.status(500).json({ message: "Error al subir la foto", error: error.message });
          }
      }
  };

  
    

export default {
    GetUsuario,
    createUsuario,
    deleteUsuario,
    updateUsuarios,
    createUsuario,
    subirFoto
}

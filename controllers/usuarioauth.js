import usuarioservice from '../services/usuarioservice.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


const secret = process.env.JWT_SECRET

const IngresoUsuario = async (req, res) => {
    console.log("Request Body:", req.body);
    const { nombre, apellido, mail, password, confirmPassword } = req.body || {};
    
    if (!nombre || !apellido || !mail || !password || !confirmPassword) {
        return res.status(400).json({ message: "Faltan campos por llenar" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    try {
        console.log("Verificando si el usuario ya existe con el correo:", mail);
        const existingcomp = await usuarioservice.GetUsuarioByEmail(mail);
        
        if (existingcomp) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        console.log("Creando el usuario...");
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newComp = await usuarioservice.createUsuario({
            nombre,
            apellido,
            mail,
            password: hashedPassword
        });

        if (!newComp) {
            return res.status(500).json({ message: "Error en la creación del usuario." });
        }

        console.log("usuario creado con éxito:", newComp);
        res.status(201).json({ message: "Usuario creado con éxito", data: newComp });
    } catch (error) {
        console.error('Error en la creación del comprador:', error.message);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

const login = async (req, res) => {
    const { mail, password } = req.body;

    if (!mail || !password) {
        return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET not configured." });
    }

    try {
        const usuario = await usuarioservice.GetUsuarioByEmail(mail);

        if (!usuario) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const isMatchusuario = await bcrypt.compare(password, usuario.password);
        if (!isMatchusuario) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const userData = { id: usuario.id, role: "usuario" };

        return res.status(200).json({ 
            message: "Login exitoso",
            token,
            data: userData
        });
    } catch (error) {
        console.error('Error durante el login:', error.message);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export default {
    IngresoUsuario,
    login
};

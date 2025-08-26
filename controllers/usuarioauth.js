import usuarioservice from '../services/usuarioservice.js';
import { guardarFotoEnDB } from '../middlewares/uploads.js';

const IngresoUsuario = async (req, res) => {

    console.log("Request Body:", req.body); // Log para ver el contenido de req.body
    const { nombre, apellido, mail, contraseña, confirmPassword } = req.body || {};
    
    if (!nombre || !apellido || !mail || !contraseña|| !confirmPassword) {
        return res.status(400).jsxon({ message: "Faltan campos por llenar" });
    }
    if (contraseña !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
      }

    try {
        console.log("Verificando si el comprador ya existe con el correo:", mail);
        const existingcomp = await usuarioservice.GetUsuarioByEmail(mail);
        
        if (existingcomp) {
            return res.status(400).json({ message: "El comprador ya existe" });
        }

        console.log("Creando el comprador...");
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const newComp = await usuarioservice.createUsuario(nombre, apellido, mail, hashedPassword);

        if (!newComp) {
            return res.status(500).json({ message: "Error en la creación del comprador." });
        }

        console.log("Comprador creado con éxito:", newComp);
        res.status(201).json({ message: "Comprador creado con éxito", data: newComp });
    } catch (error) {
        console.error('Error en la creación del comprador:', error.message);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

const login = async (req, res) => {
    const { mail, contraseña } = req.body;

    if (!mail || !contraseña) {
        return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    if (!process.env.JWT_SECRET) {
        console.log(process.env.JWT_SECRET);
        return res.status(500).json({ message: "JWT_SECRET not configured." });
    }
    try {
        // Buscando al comprador y vendedor por email
        const comprador = await CompradoresService.getCompradorByEmail(mail);
        const vendedor = await vendedorServices.getVendedoresByEmail(mail);

        if (!comprador && !vendedor) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Verificar la contraseña y generar un token según el rol
        let token = null;
        let userData = null;

        if (comprador) {
            const isMatchcomprador = await bcrypt.compare(contraseña, comprador.contraseña);
            if (!isMatchcomprador) {
                return res.status(400).json({ message: "Contraseña incorrecta" });
            }
            token = jwt.sign({ id: comprador.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            userData = { id: comprador.id, role: "comprador" };
        } else if (vendedor) {
            const isMatchvendedor = await bcrypt.compare(contraseña, vendedor.contraseña);
            if (!isMatchvendedor) {
                return res.status(400).json({ message: "Contraseña incorrecta" });
            }
            token = jwt.sign({ id: vendedor.id }, process.env.JWT_SECRET, { expiresIn: "168h" });
            userData = { id: vendedor.id, role: "vendedor" };
        }
        console.log(userData);
        return res.status(200).json({ 
            message: "Login exitoso", 
            token: token,
            data: userData
        });
    } catch (error) {
        console.error('Error durante el login:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export default {
    IngresoUsuario,
    login
}
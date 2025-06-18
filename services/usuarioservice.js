import {config} from '../dbconfig.js';
import pkg from 'pg';
const { Client } = pkg;

const getAllUsuario = async () => {
    const client = new Client(config); 
    await client.connect();

    try {
        const { rows } = await client.query("SELECT * FROM usuario");
        return rows;
    } catch (error) {
        console.error('Error al obtener compradores:', error);
        throw new Error('Error al obtener compradores');
    } finally {
        await client.end();
    }
};

const createUsuario = async (usuario) => {
  const client = new Client(config);
  try {
    await client.connect();

    const query = `INSERT INTO users (nombre, mail, password, apellido, id_foto) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [usuario.nombre, usuario.mail, usuario.password, usuario.apellido, usuario.id_foto];
    
    const { rows } = await client.query(query, values);
    return rows[0];    
    
  } catch (error) {
    console.error(' Error al crear usuario:', error);
    throw error;
  } finally {
    await client.end();
  }
};

export const eliminarUsuario = async (id) => {
  const client = new Client(config);
  try {
    await client.connect();
    const result = await client.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      throw new Error('Usuario no encontrado');
    }

    return result.rows[0];
  } finally {
    await client.end();
  }
};

const updateuser = async (nombre, apellido, mail, password, id) => {
  const client = new Client(config);
  await client.connect();

  console.log("Datos recibidos en el servicio:", { nombre, apellido, mail, password, id });

  try {
      const result = await client.query(
          'UPDATE users SET nombre = $1 apellido = $2, mail = $3, password = $4 WHERE id = $5 RETURNING *',
          [nombre, apellido, mail, password, parseInt(id)]
      );

      console.log("Resultado de la actualización:", result);

      if (result.rowCount > 0) {
          return result.rows[0];
      } else {
          return null;
      }
  } catch (error) {
      console.error("Error en la actualización:", error);
      throw error;
  } finally {
      await client.end();
  }
};

const deleteuser = async (id) => {
    
  const client = new Client(config);
    await client.connect();
    const result = await client.query("DELETE FROM users WHERE id = $1 RETURNING* ", [id]);
    if (result.rows.length > 0) {
        return result;
    }
    else {
        return null;
    }
};




export default {
    getAllUsuario,
    createUsuario, 
    updateuser,
    deleteuser
}

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


export default {
    getAllUsuario,
    createUsuario
}

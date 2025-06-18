import {config} from '../dbconfig.js';
import pkg from 'pg';
const { Client } = pkg;

const obtenerResultados = async (id) => {
    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM resultados WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            throw new Error('No se encontraron resultados para este usuario');
        }

        return result.rows;
    } catch (error) {
        console.error("Error al obtener resultados:", error.message);
        throw error;
    } finally {
        await client.end();
    }
}

export default {
    obtenerResultados
}
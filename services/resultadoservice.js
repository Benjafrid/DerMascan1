import {config} from '../dbconfig.js';
import pkg from 'pg';
const { Client } = pkg;

const obtenerResultados = async (id) => {
    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM resultado WHERE id = $1', [id]);

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
};

const createResultado = async (resultado) => {
    const client = new Client(config);
    try {
        await client.connect();
        const query = `INSERT INTO resultado (id, id_fotos, diametro, imagen, ) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [resultado.id_usuario, resultado.id_examen, resultado.fecha, resultado.puntaje];
        
        const { rows } = await client.query (query, values);
        return rows[0];
    } catch (error) {
        console.error('Error al crear resultado:', error);
        throw error;
    } finally {
        await client.end();
    }
}

export default {
    obtenerResultados,
    createResultado
}
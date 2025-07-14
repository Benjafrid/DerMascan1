import { Client } from 'pg';
import { config } from '../dbconfig.js';

const createResultado = async (resultado) => {
  const client = new Client(config);
  try {
    await client.connect();

    const values = [
      resultado.diametro,
      resultado.imagen,
      resultado.id_foto,
      resultado.resultado_general
    ];

    const query = `
      INSERT INTO resultado (diametro, imagen, id_foto, resultado_general)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const { rows } = await client.query(query, values);
    return rows[0];

  } catch (error) {
    console.error('Error al crear resultado:', error);
    throw error;
  } finally {
    await client.end();
  }
};

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

export default {
  createResultado,
  obtenerResultados
};

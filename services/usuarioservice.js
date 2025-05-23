import {config} from '../dbconfig.js';
import pkg from 'pg';
const { Client } = pkg;

const getUsuarioByEmail = async (mail) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM usuario WHERE mail = $1",
            [mail]
        );
        if (rows.length < 1) return null;

        await client.end();
        return rows[0];
    } catch (error) {
        await client.end();
        throw error;
    }
};

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

const getUsuarioById = async(id) => {
    const client = new Client(config);
    const query = 'SELECT * FROM usuario WHERE id = $1';
}


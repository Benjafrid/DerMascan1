import resultadosService from '../services/resultadoservice.js';

const getResultados = async (req, res) => {
    const { id } = req.params;
    try {
        const resultados = await resultadosService.obtenerResultados(id);
        res.status(200).json({
            message: 'Resultados obtenidos correctamente',
            data: resultados
        });
    } catch (error) {
        console.error("Error al obtener resultados:", error.message);
        res.status(500).json({
            message: "Error al obtener resultados",
            error: error.message
        });
    }   
}

export default {
    getResultados
}
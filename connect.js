// Este archivo es para guardar temporalmente la función de conexión Front - Back a IA
import { Request, Response } from 'express'
linkAI = 'https://crespo-ia.vercel.app'


const response = fetch(linkAI, { //preguntarle al facha de este link
    method: 'POST',
    body: req.file
});

const hola = await response.json();
//no hay funcion de fridman
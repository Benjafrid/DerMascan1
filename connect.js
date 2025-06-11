// Este archivo es para guardar temporalmente la función de conexión Front - Back a IA
import { Request, Response } from 'express'
linkAI = 'https://crespo-ia.vercel.app'


const response = fetch(linkdelaAI, { //preguntarle al facha de este link
    method: 'POST',
    body: req.file
});

const foto = await response.json();
//no hay funcion de fridman. Que la funcion suba las fotos con cloudinary
//necesito link de crespo (IA)
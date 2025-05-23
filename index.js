import express from 'express';
import cors from 'cors';
import usuariorouter from './router/usuariorouter.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (_, res) => {
  res.send("API WORKING");
});

app.use('/usuarios', usuariorouter);

export default app;

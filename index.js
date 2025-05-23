import express from "express";
import usuariorouter  from "./router/usuariorouter.js";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*", // origen permitido
    methods: ['GET', 'POST', 'DELETE', 'PUT' , 'OPTIONS'],
    allowedheaders: ['Content-Type', 'Authorization']
  }));

  app.get("/", async(_,res) =>{
    res.send("API WORKING")
   })

  app.listen(3000, () => {
    console.log("PrintMe en puerto 3000");
});
// Importar el router de usuarios

app.use("/usuarios", usuariorouter);
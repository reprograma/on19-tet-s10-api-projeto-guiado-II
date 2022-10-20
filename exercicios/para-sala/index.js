const express = require('express');
const app = express();
const port = 3333;

app.use(express.json());

app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
})

//marcar consulta


//adicionar novo usuários
app.post("/ clientes/add", (req) => {
    const novoCliente = req.body;
})
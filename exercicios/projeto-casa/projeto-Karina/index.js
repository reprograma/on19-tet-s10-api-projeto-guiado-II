const express = require('express');  //Foi declarado (importado)
const app = express();  //Foi inicializado (instânciado)
const port = 3000;
const listaClientes = require('./model/contas-clientes.json'); //Foi declarado lista de cliente e mostrado qual caminho

app.use(express.json());

//Criar os clientes do banco

app.post("/")

//Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch("/")

//Fazer depósitos / pagamentos usando o saldo de sua conta
app.patch("/")


//Encerrar contas de clientes
app.delete("/")


//Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
app.get("/")









app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
  });
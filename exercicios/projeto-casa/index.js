const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const port = 3000;
const listaDeClientes = require("./model/contas-clientes.json");

app.use(express.json());

// - Criar os clientes do banco - DONE
app.post("/clientes", (req, res) => {
  const { nome_cliente, cpf_cliente, data_nascimento, email, conta } = req.body;

  const id = uuidv4();

  const novoCliente = {
    id,
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    email,
    conta,
  };
  novoCliente.conta.numero = parseInt(Math.random() * 10000000);
  novoCliente.conta.saldo = 0;
  novoCliente.conta.data_criacao = new Date().toISOString();
  listaDeClientes.push(novoCliente);
  return res.status(201).json(novoCliente);
});

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});

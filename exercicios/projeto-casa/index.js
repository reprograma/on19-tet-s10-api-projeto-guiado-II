const express = require("express");
const app = express();
const port = 3333;
const listaClientes = require("./model/contas-clientes.json");
const novaConta = Math.floor(Math.random() * 10000000);
app.use(express.json());

//Atualizar ID automaticamente
const recebeUltimoID = () => {
  const novoArrayOrdenado = listaClientes.sort((clienteA, clienteB) => {
    if (clienteA.id < clienteB.id) {
      return -1;
    }
    if (clienteA.id > clienteB.id) {
      return 1;
    }

    return 0;
  });

  const valorUltimoID = novoArrayOrdenado[novoArrayOrdenado.length - 1];

  return valorUltimoID.id + 1;
};


//POST - Criar os clientes do banco - Post
app.post("/clientes/add", (req, res) => {
  const {
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    endereco,
    telefone,
    conta: { tipo, saldo },
  } = req.body;

  const IDNovo = recebeUltimoID();

  const novoClienteComID = {
    id: IDNovo,
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    endereco,
    telefone,
    conta: {
      numero: novaConta,
      tipo,
      saldo,
      data_criacao: new Date(),
    },
  };

  listaClientes.push(novoClienteComID);
  return res.json(novoClienteComID);
});


//PATCH - atualizar endereco e telefone
app.patch("/clientes/update/:id", (req, res) => {
  const idCliente = req.params.id;
  let bodyRequest = req.body.endereco;
  let bodyFone = req.body.telefone;

  filtrarCliente = listaClientes.find((cliente) => cliente.id == idCliente);

  if (filtrarCliente == undefined) {
    res.status(404).send({ message: "Informar um Id valido" });
  }

  filtrarCliente.endereco = bodyRequest;
  filtrarCliente.telefone = bodyFone

  res.status(200).json([
    {
      mensagem: "Endereço e Telefone atualizado com sucesso.",
      filtrarCliente,
    },
  ]);
});

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});


//PATCH - Fazer depósitos / pagamentos usando o saldo de sua conta - PATCH (usar o + e o -)


//DELETE - Encerrar contas de clientes - DELETE

//GET - Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... - FILTRO



/*
- Criar os clientes do banco - Post - ok
- Atualizar informações desses clientes ( como endereço, telefone de contato...) PATCH - ok
- Fazer depósitos / pagamentos usando o saldo de sua conta - PATCH (usar o + e o -)
- Encerrar contas de clientes - DELETE
- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... - FILTRO
  */

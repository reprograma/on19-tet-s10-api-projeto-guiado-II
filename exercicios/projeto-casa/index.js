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

//PATCH - Deposito
app.patch("/clientes/:id/deposito", (req, res) => {
  const idCliente = req.params.id;
  let bodyRequest = req.body.conta.saldo;

  filtrarCliente = listaClientes.find((cliente) => cliente.id == idCliente); //filtra id

  if (filtrarCliente == undefined) {
    res.status(404).send({ message: "Informar um Id valido" }); //filtro caso for id errado
  }

  filtrarCliente.conta.saldo += bodyRequest; //filtra atualizando o saldo

  res.status(200).json([
    {
      mensagem: `Pagamento de R$${bodyRequest} realizado com sucesso.`,
      filtrarCliente,
    },
  ]);
});

//PATCH - Pagamento
app.patch("/clientes/:id/pagamento", (req, res) => {
  const idCliente = req.params.id;
  let bodyRequest = req.body.conta.saldo;

  const filtrarCliente = listaClientes.find(
    (cliente) => cliente.id == idCliente
  ); //filtra id

  if (filtrarCliente == undefined) {
    res.status(404).send({ message: "Informar um Id valido" }); //filtro caso for id errado
  }

  if (filtrarCliente.conta.saldo < bodyRequest) {
    // validando se saldo for menor que pagamento
    res.status(400).send({ message: "Saldo insuficiente" });
  }

  if (filtrarCliente.conta.saldo >= bodyRequest) {
    // Se saldo for >= a requisao

    filtrarCliente.conta.saldo -= bodyRequest; // faz o pagamento

    res.status(200).json([
      {
        mensagem: `Pagamento de R$${bodyRequest} realizado com sucesso.`,
        filtrarCliente,
      },
    ]);
  }
});

//PATCH - Atualizar endereco e telefone
app.patch("/clientes/update/:id", (req, res) => {
  const idCliente = req.params.id; // identifica o id do cliente
  let bodyRequest = req.body.endereco; // colhe o endereço para atualizar
  let bodyFone = req.body.telefone; // colhe o endereço para atualizar

  filtrarCliente = listaClientes.find((cliente) => cliente.id == idCliente); //filtra id

  if (filtrarCliente == undefined) {
    res.status(404).send({ message: "Informar um Id valido" }); //filtro caso for id errado
  }

  filtrarCliente.endereco = bodyRequest; //filtra atualizando o endereço
  filtrarCliente.telefone = bodyFone; // filtra atualizando

  res.status(200).json([
    {
      mensagem: "Endereço e Telefone atualizado com sucesso.",
      filtrarCliente,
    },
  ]);
});

//DELETE - Encerrar contas de clientes - DELETE
app.delete("/clientes/:id", (req, res) => {
  const idCliente = req.params.id;

  const filtrarCliente = listaClientes.find((usuario) => usuario.id == idCliente);

  if (filtrarCliente) {
    listaClientes.map((cliente, index) => {
      if (cliente.id == idCliente) {
        return listaClientes.splice(index, 1);
      }
    });
    return res.status(200).json({
      message: `O usuário ${filtrarCliente.nome_cliente} foi deletado com sucesso`,
    });
  }
  return res.status(404).json({
    message: "Cliente não foi encontarado",
  });
});

//GET - Filtrar os clientes do banco pelo seu nome e CPF
//http://localhost:3333/clientes?nome=Beatrice
//http://localhost:3333/clientes?cpf=514.196.671-22
app.get("/clientes", (req, res) => {
  const filtrarNome = req.query.nome?.toLowerCase();
  const filtrarCPF = req.query.cpf;

  const filtrarCliente = listaClientes.filter((usuario) => {
    if (filtrarNome) {
      return usuario.nome_cliente.toLowerCase().includes(filtrarNome);
    }

    if (filtrarCPF) {
      return usuario.cpf_cliente == filtrarCPF;
    }

    return usuario;
  });

  return res.status(200).json(filtrarCliente);
});

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});

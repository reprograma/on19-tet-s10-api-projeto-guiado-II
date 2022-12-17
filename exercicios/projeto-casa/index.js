const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid");
const newAccount = Math.floor(Math.random() * 30000000);
const contasClientes = require("./model/contas-clientes.json");

app.use(express.json());

app.post("/conta/add", (req, res) => {
  const {
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: { tipo },
  } = req.body;
  const existeCPF = contasClientes.find(
    (conta) => conta.cpf_cliente == cpf_cliente
  );

  if (!existeCPF) {
    const newCliente = {
      id: uuidv4(),
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: {
        numero: newAccount,
        tipo,
        saldo: 0,
        data_criacao: new Date().toISOString(),
     
      },
    };
    contasClientes.push(newCliente);
    return res.status(201).json(contasClientes);
  }
  return res.status(404).json({
    messagem: `Cliente com CPF: ${cpf_cliente} Conta já cadastrada`,
  });
});


app.patch("/conta/:id/consulta", (req, res) => {
  const idCliente = req.params.id;
  const { telefone: newNumber } = req.body;

  const existeCliente = contasClientes.find((conta) => conta.id == idCliente);

  if (existeCliente) {
    const atualizarCliente = contasClientes.map((conta) => {
      conta.telefone = newNumber;

      return { ...conta };
    });
    return res.status(200).json(atualizarCliente);
  }
  return res
    .status(404)
    .json({ messagem: "Cliente não foi encontrado." });
});

app.patch("/conta/:id/deposito", (req, res) => {
  const idCliente = req.params.id;
  const { deposito } = req.body;

  const clienteExiste = contasClientes.find(
    (cliente) => cliente.id == idCliente
  );

  if (clienteExiste) {
    const efetuarDeposito = {
      ...clienteExiste.conta,
      saldo: clienteExiste.conta.saldo + deposito,
    };

    contasClientes.map((cliente, index) => {
      if (cliente.id == idCliente) {
        contasClientes[index].conta = efetuarDeposito;
      }
    });
    return res.status(200).json(contasClientes);
  }
  return res.status(404).json({
    messagem:
      "Erro no depósito. Tente novamente.",
  });
});

app.patch("/conta/:id/pagamento", (req, res) => {
  const idCliente = req.params.id;
  const { pagamento } = req.body;

  const clienteExiste = contasClientes.find(
    (cliente) => cliente.id == idCliente
  );

  if (clienteExiste.conta.saldo >= pagamento) {
    const efetuarPagamento = {
      ...clienteExiste.conta,
      saldo: clienteExiste.conta.saldo - pagamento,
    };

    contasClientes.map((cliente, index) => {
      if (cliente.id == idCliente) {
        contasClientes[index].conta = efetuarPagamento;
      }
    });
    return res.status(200).json(contasClientes);
  }
  return res.status(400).json({
    messagem:
      "Pagamento maior que o saldo",
  });
});


app.delete("/conta/deletar/:id", (req, res) => {
  const idCliente = req.params.id;

  const existeCliente = contasClientes.find((conta) => conta.id == idCliente);

  if (existeCliente) {
    contasClientes.map((conta, index) => {
      if (conta.id == idCliente) {
        return contasClientes.splice(index, 1);
      }
    });
    return res.status(200).json(contasClientes);
  }
  return res.status(404).json({
    message: "O cliente não encontrado",
  });
});

app.get("/conta/filtros", (req, res) => {
  const filtrarNome = req.params.nome;
  const filtrarNascimento = req.params.data;
  const filtrarSaldo = parseFloat(req.params.saldo);

  const prodFiltros = contasClientes.find((item) => {
    if (filtrarNome) {
      return item.nome_cliente.toLowerCase() == filtrarNome.toLowerCase();
    }
    if (filtrarNascimento) {
      return item.data_nascimento == filtrarNascimento;
    }
    if (filtrarSaldo) {
      return item.conta.saldo == filtrarSaldo;
    }
    return item;
  });
  return res.status(200).json(prodFiltros);
});

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});
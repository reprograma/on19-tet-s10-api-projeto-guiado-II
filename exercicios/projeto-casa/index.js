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
  const numeroDaConta = parseInt(Math.random() * 10000000);
  const dataDeCriacao = new Date().toISOString();

  const novoCliente = {
    id,
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    email,
    conta: {
      numero: numeroDaConta,
      saldo: 0,
      data_criacao: dataDeCriacao,
    },
  };
  listaDeClientes.push(novoCliente);
  return res.status(201).json(novoCliente);
});

// - Atualizar informações desses clientes - DONE
app.patch("/clientes/:id", (req, res) => {
  const IDCliente = req.params.id;
  const { nome_cliente, email } = req.body;

  const cliente = listaDeClientes.find((cliente) => cliente.id == IDCliente);

  if (cliente) {
    const clienteAtualzado = {
      ...cliente,
      nome_cliente,
      email,
    };
    listaDeClientes.map((cliente, index) => {
      if (cliente.id == IDCliente) {
        listaDeClientes[index] = clienteAtualzado;
      }
    });
    return res.status(200).json({
      message: `O cliente ${cliente.nome_cliente} foi atualizado com sucesso`,
    });
  }
  return res.status(404).json({ message: `Cliente não encontrado.` });
});

// - Fazer depósitos / pagamentos usando o saldo de sua conta - DONE
app.patch("/clientes/:id/deposito", (req, res) => {
  const IDCliente = req.params.id;
  const deposito = req.query;

  const cliente = listaDeClientes.find((cliente) => cliente.id == IDCliente);

  if (cliente) {
    listaDeClientes.map((cliente) => {
      const valorDeposito = +Object.values(deposito);
      if (valorDeposito <= 0) {
        return res.json({ message: `Valor inválido.` });
      }
      return (cliente.conta.saldo += valorDeposito).toFixed(2);
    });
    return res.status(200).json({
      message: `Depósito realizado com sucesso`,
    });
  }

  return res.status(404).json({ message: `Cliente não encontrado.` });
});

app.patch("/clientes/:id/pagamento", (req, res) => {
  const IDCliente = req.params.id;
  const pagamento = req.query;

  const cliente = listaDeClientes.find((cliente) => cliente.id == IDCliente);

  if (cliente) {
    listaDeClientes.map((cliente) => {
      const valorPagamento = +Object.values(pagamento);
      if (cliente.conta.saldo < valorPagamento) {
        return res.json({ message: `Saldo insuficiente.` });
      }
      return (cliente.conta.saldo -= valorPagamento).toFixed(2);
    });

    return res.status(200).json({
      message: `Pagamento realizado com sucesso`,
    });
  }

  return res.status(404).json({ message: `Cliente não encontrado.` });
});
/*
app.patch("/clientes/:id/transacao", (req, res) => { // rota única de transação - muita responsabilidade na query!!
  const IDCliente = req.params.id;
  const transacao = Object.keys(req.query);

  const cliente = listaDeClientes.find((cliente) => cliente.id == IDCliente);

  if (cliente) {
    if (transacao == "deposito") {
      listaDeClientes.map((cliente) => {
        if (cliente.id == IDCliente) {
          const valorDeposito = +Object.values(req.query);
          if (valorDeposito <= 0) {
            return res.json({ message: "Valor inválido." });
          }
          const saldoFinal = (cliente.conta.saldo += valorDeposito).toFixed(2);
          return saldoFinal;
        }
      });
      return res.send({ message: `Depósito realizado com sucesso` });
    }
    if (transacao == "pagamento") {
      listaDeClientes.map((cliente) => {
        if (cliente.id === IDCliente) {
          const valorPagamento = +Object.values(req.query);
          if (cliente.conta.saldo < valorPagamento) {
            res.send({ message: "Saldo insuficiente." });
            return;
          }
          return (cliente.conta.saldo -= valorPagamento).toFixed(2);
        }
      });
    }
    return res.status(200).json({
      message: `Pagamento realizado com sucesso`,
    });
  }
  return res.status(404).json({ message: `Cliente não encontrado.` });
});
*/

// - Encerrar contas de clientes - DONE
app.delete("/clientes/:id", (req, res) => {
  const IDCliente = req.params.id;

  const cliente = listaDeClientes.find((cliente) => cliente.id == IDCliente);

  if (cliente) {
    listaDeClientes.map((cliente, index) => {
      if (cliente.id == IDCliente) {
        return listaDeClientes.splice(index, 1);
      }
    });

    return res
      .status(200)
      .json({ message: "Conta encerrada com sucesso", cliente: cliente });
  }
  return res.status(404).json({ message: `Cliente não foi encontrado.` });
});

//- Listar todos os clientes do banco
app.get("/clientes/lista", (req, res) => {
  res.json(listaDeClientes);
});

//- Conseguir Filtrar os clientes do banco pelo seu nome, por saldo. DONE
app.get("/clientes", (req, res) => {
  const filtroSaldo = req.query;
  const filtroCpf = req.query.cpf_cliente;
  const filtroEmail = req.query.email;
  const filtroNome = req.query.nome_cliente;

  const cliente = listaDeClientes.filter((item) => {
    if (filtroNome) {
      return (
        item.nome_cliente.toLowerCase().replace(/ /g, "") ==
        filtroNome.toLowerCase().replace(/ /g, "")
      );
    }
    if (filtroCpf) {
      return (
        item.cpf_cliente.replace(/[^\d]/g, "") ==
        filtroCpf.replace(/[^\d]/g, "")
      );
    }
    if (filtroEmail) {
      return item.email === filtroEmail;
    }
    if (filtroSaldo) {
      return item.conta.saldo == filtroSaldo.saldo;
    }
    return item;
  });
  res.json(cliente);
});

//- Listar cliente por id
app.get("/clientes/:id", (req, res) => {
  const id = req.params.id;

  const cliente = listaDeClientes.filter((item) => item.id == id);
  res.json(cliente);
});

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});

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

// - Atualizar informações desses clientes - DONE
app.patch("/clientes/:id", (req, res) => {
  const IDCliente = req.params.id;
  const nome_cliente = req.body;

  const cliente = listaDeClientes.find((cliente) => cliente.id == IDCliente);

  if (cliente) {
    const clienteAtualzado = {
      ...cliente,
      ...nome_cliente,
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
app.patch("/clientes/:id/transacao", (req, res) => {
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

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});

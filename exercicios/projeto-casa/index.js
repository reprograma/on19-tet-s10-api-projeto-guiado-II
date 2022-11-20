const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid");
const novaConta = Math.floor(Math.random() * 10000000);
const contasClientes = require("./model/contas-clientes.json");

app.use(express.json());

// - Criar os clientes do banco
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
    const novoCliente = {
      id: uuidv4(),
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: {
        numero: novaConta,
        tipo,
        saldo: 0,
        data_criacao: new Date().toISOString(),
        //.toString()
        //.toLocaleString('br', { timeZone: 'America/Sao_Paulo' }),
    },
};
contasClientes.push(novoCliente);
return res.status(201).json(contasClientes);
}
return res.status(404).json({
messagem: `Cliente com CPF: ${cpf_cliente} já possui conta cadastrada na AreiasBank`,
});
});

// - Atualizar informações desses clientes ( como endereço, telefone de contato...)
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
    .json({ messagem: "Cliente não foi encontrado. Digite o ID correto." });
});
// - Fazer depósitos / pagamentos usando o saldo de sua conta
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
      "Não foi possível realizar o depósito, o cliente não foi encontrado! Tente novamente!",
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
      "O pagamento que está tentando realizar é maior que o saldo atual",
  });
});

// - Encerrar contas de clientes
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
    message: "O cliente não foi encontrado. Digite o ID correto",
  });
});
// - Conseguir Filtrar os clientes do banco pelo seu nome, por saldo...
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
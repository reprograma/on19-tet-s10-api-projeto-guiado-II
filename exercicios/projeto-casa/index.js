const express = require("express");
const index = require("uuid-random");
const app = express();
const port = 3000;
const uuid = require("uuid-random");
const novaConta = Math.floor(Math.random() * 10000000);

app.use(express.json());

const contasClientes = require("./model/contas-clientes.json");

// [DONE] - Criar os clientes do banco

app.post("/contas/add", (req, res) => {
  const {
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: { tipo, saldo },
  } = req.body;
  const existeContaComCpf = contasClientes.find(
    (conta) => conta.cpf_cliente == cpf_cliente
  );

  if (!existeContaComCpf) {
    const novoClienteComCpf = {
      id: uuid(),
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: {
        numero: novaConta,
        tipo,
        saldo,
        data_criacao: new Date().toISOString(),
      },
    };
    contasClientes.push(novoClienteComCpf);
    return res.status(200).json(novoClienteComCpf);
  }
  return res.status(404).json({
    messagem: `Cliente com CPF: ${cpf_cliente} já possui conta cadastrada neste Banco`,
  });
});

// [DONE]- Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch("/contas/:cpf_cliente", (req, res) => {
  const cpfCliente = req.params.cpf_cliente;
  const endereço_cliente = req.body;

  const existeContaComCpf = contasClientes.find(
    (conta) => conta.cpf_cliente == cpfCliente
  );

  if (existeContaComCpf) {
    const clienteAtualizado = {
      ...existeContaComCpf,
      endereço_cliente,
    };
    contasClientes.map((cliente, index) => {
      if (cliente.cpf_cliente == cpfCliente) {
        contasClientes.push({
          ...endereço_cliente,
        });
      }
    });

    return res.status(200).json({ clienteAtualizado });
  }

  return res.status(404).json({ menssagem: "Cliente inexistente" });
});

// - [IN PROGRESS] Fazer depósitos / pagamentos usando o saldo de sua conta
//[DONE]
app.patch("/conta/deposito", (req, res) => {
  const cpfClienteContaCreditada = req.query.cpf_cliente;
  const deposito = 1000;
  const saldo = req.body;

  const existeConta = contasClientes.find(
    (conta) => contasClientes.cpf_cliente == cpfClienteContaCreditada
  );
  if (existeConta) {
    const clienteSaldoAtualizado = {
      ...existeConta.conta,
      saldo: saldo.conta.saldo + deposito,
    };
    contasClientes.map((cliente, index) => {
      if (contasClientes.cpf_cliente == cpfClienteContaCreditada) {
        contasClientes.push({
          ...clienteSaldoAtualizado,
        });
      }
    });

    return res.status(200).json({ clienteSaldoAtualizado });
  }
  return;
  res.status(404).json({ message: "Cliente não identificado" });
});

//[IN PROGRESS]

app.patch("/conta/pagamento", (req, res) => {
  const cpfClienteContaRealizaPagamento = req.query.cpf_cliente;
  const valorPagamento = 3000;
  const saldo = req.body;

  const existeConta = contasClientes.find(
    (conta) => contasClientes.cpf_cliente == cpfClienteContaRealizaPagamento
  );
  if (existeConta) {
    const existeSaldoSuficiente = contasClientes.find(
      (conta) => contasClientes.conta.saldo >= valorPagamento
      
    );
    if (existeSaldoSuficiente) {
      const pagamentoRealizado = {
        ...existeConta.conta,
        saldo: saldo.conta.saldo - valorPagamento,
      };
      contasClientes.map((cliente, index) => {
        if (cpfClienteContaRealizaPagamento == cpf_cliente) {
          contasClientes.push({
            ...pagamentoRealizado,
          });
        }
      });
    }

    return res.status(200).json({ pagamentoRealizado });
  }
  return;
  res.status(404).json({ message: "Saldo insuficiente" });
});

// [DONE]- Encerrar contas de clientes
app.delete("/contas/:conta", (req, res) => {
  const contaADeletar = req.params.conta;
  const clienteADeletar = contasClientes.find(
    (cliente) => cliente.conta.numero == contaADeletar
  );

  if (clienteADeletar) {
    contasClientes.map((cliente, index) => {
      if (cliente.conta.numero == contaADeletar) {
        return contasClientes.splice(index, 1);
      }
    });
    return res.status(200).json(contasClientes);
  }

  return res.status(404).json({
    mensagem: `A conta de número ${contaADeletar} não encontrada`,
  });
});
// - [DONE] Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

app.get("/contas", (req, res) => {
  const filtroNome = req.query.nome;
  const filtroCpf = req.query.cpf;
  const filtroNumeroDaConta = req.query.conta;
  const filtroTipoDaConta = req.query.tipodaconta;
  const filtroDataDeNascimento = req.query.datadenascimento;
  const filtroDataDeCriação = req.query.dataDeCriação;
  const filtroID = req.query.id;
  const filtroPorSaldo = req.query.saldo;

  const contaFiltrada = contasClientes.filter((conta) => {
    if (filtroNome) {
      return conta.nome_cliente.toLowerCase() == filtroNome.toLowerCase();
    }
    if (filtroCpf) {
      return conta.cpf_cliente == filtroCpf;
    }
    if (filtroNumeroDaConta) {
      return conta.conta.numero == filtroNumeroDaConta;
    }
    if (filtroTipoDaConta) {
      return conta.conta.tipo == filtroTipoDaConta;
    }
    if (filtroDataDeNascimento) {
      return conta.data_nascimento == filtroDataDeNascimento;
    }
    if (filtroDataDeCriação) {
      return conta.conta.data_criacao == filtroDataDeCriação;
    }
    if (filtroID) {
      return conta.id == filtroID;
    }
    if (filtroPorSaldo) {
      return conta.conta.saldo == filtroPorSaldo;
    }
    return conta;
  });
  res.json(contaFiltrada);
});

app.listen(port, () => {
  console.log(`Api está rodando na porta ${port}`);
});

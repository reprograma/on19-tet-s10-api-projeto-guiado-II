const express = require("express");
const app = express();
const port = 3000;
const uuid = require("uuid");
const listaClientes = require("./model/contas-clientes.json");

app.use(express.json());

//- Criar os clientes do banco = DONE
app.post("/clientes/add", (req, res) => {
  const {
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: { tipo },
  } = req.body;
  const IDUnico = uuid.v4();
  const numeroConta = Math.floor(Math.random() * 10000000);
  const dataCriacao = new Date().toISOString();

  const existeCpf = listaClientes.find(
    (conta) => conta.cpf_cliente == cpf_cliente
  );
  if (!existeCpf) {
    const novoCliente = {
      id: IDUnico,
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: {
        numero: numeroConta,
        tipo,
        data_criacao: dataCriacao,
      },
    };
    listaClientes.push(novoCliente);
    return res.status(201).json(novoCliente);
  }
  return res.status(404).json({ messagem: "CPF ja existente" });
});

//- Atualizar informações desses clientes ( como endereço, telefone de contato...) = DONE
app.put("/clientes/:id", (req, res) => {
  const cadastrosId = req.params.id;
  const dadosAtualizados = req.body;

  const existeUsuario = listaClientes.find(
    (usuario) => usuario.id == cadastrosId
  );
  if (existeUsuario) {
    listaClientes.map((usuario, index) => {
      if (usuario.id == cadastrosId) {
        return (listaClientes[index].dadosAtualizados = dadosAtualizados);
      }
    });

    return res.status(200).json(listaClientes);
  }
  return res.status(404).json({ messagem: "Usuario não encontrado" });
});

//depositar usando saldo da conta = DONE
app.patch("/deposito", (req, res) => {
  const cpfCliente = req.query.cpf_cliente;
  const valorDepositado = req.body;
  const existeCliente = listaClientes.find(
    (cliente) => cliente.cpf_cliente === cpfCliente
  );

  if (existeCliente) {
    const novoSaldo = {
      ...existeCliente.conta,
      saldo: valorDepositado.conta.saldo,
    };
    listaClientes.map((cliente, index) => {
      if (cliente.cpf_cliente == cpfCliente) {
        return (listaClientes[index].conta.saldo = novoSaldo);
      }
    });
    return res.status(202).json(novoSaldo);
  }
  return res
    .status(404)
    .json({
      message:
        "O CPF informado não pode ser localizado, por favor confira os dados e tente novamente!",
    });
});

//fazer pagamento usando saldo da conta = DONE
app.patch("/pagamentos", (req, res) => {
  const cpfCliente = req.query.cpf_cliente;
  const valorpagamento = req.body;
  const existeCliente = listaClientes.find(
    (cliente) => cliente.cpf_cliente === cpfCliente);
  const valorPagamento = - 3000

  if (existeCliente) {
    const novoSaldo = {
      ...existeCliente.conta,
      saldo: valorpagamento.conta.saldo - valorPagamento,
    };
    listaClientes.map((cliente, index) => {
      if (cliente.cpf_cliente == cpfCliente) {
        return (listaClientes[index].conta.saldo = novoSaldo);
      }
    });
    return res.status(202).json(novoSaldo);
  }
  return res
    .status(404)
    .json({
      message:
        "O CPF informado não pode ser localizado, por favor confira os dados e tente novamente!",
    });
});


//- Encerrar contas de clientes = DONE
app.delete("/clientes/:id", (req, res) => {
  const idCliente = req.params.id;
  const existeCliente = listaClientes.find(
    (usuario) => usuario.id == idCliente
  );

  if (existeCliente) {
    listaClientes.map((usuario, index) => {
      if (usuario.id == idCliente) {
        return listaClientes.splice(index, 1);
      }
    });
    return res.status(200).json(listaClientes);
  }
  return res.status(404).json({
    messagem:
      "O usuario não pode ser localizado, por favor confira os dados informados!",
  });
});

//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo - DONE
app.get("/clientes", (req, res) => {
  const filtroNome = req.query.nome;
  const filtroCPF = req.query.CPF;

  const clienteSelecionado = listaClientes.filter((cliente) => {
    if (filtroNome) {
      return cliente.nome_cliente.toLowerCase() == filtroNome.toLowerCase();
    }
    if (filtroCPF) {
      return cliente.cpf_cliente == filtroCPF;
    }
    return cliente;
  });
  return res.json(clienteSelecionado);
});

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});

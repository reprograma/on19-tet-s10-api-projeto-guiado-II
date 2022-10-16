const express = require('express');
const app = express();
const port = 3333;
const listaClientes = require('./model/consultas-clientes.json');

app.use(express.json());

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

const recebeUltimoIDConsultas = (cliente) => {
  const arrayDeConsultasOrdenado = cliente.procedimentos.sort(
    (consultaA, consultaB) => {
      if (consultaA.id < consultaB.id) {
        return -1;
      }
      if (consultaA.id > consultaB.id) {
        return 1;
      }
      return 0;
    }
  );
  const consultaMaiorID =
    arrayDeConsultasOrdenado[arrayDeConsultasOrdenado.length - 1];

  return consultaMaiorID?.id + 1 || 0;
};
// - Os usuários conseguiram marcar uma consulta - DONE
app.patch('/clientes/:id/consulta', (req, res) => {
  const { nome, data } = req.body;
  const IDCliente = req.params.id;

  const existeCliente = listaClientes.find(
    (cliente) => cliente.id == IDCliente
  );

  if (existeCliente) {
    const ultimoIDConsultas = recebeUltimoIDConsultas(existeCliente);
    const novaConsulta = {
      id: ultimoIDConsultas,
      nome: nome,
      data: data,
    };
    listaClientes.map((cliente, index) => {
      if (cliente.id == IDCliente) {
        listaClientes[index].procedimentos.push({
          ...novaConsulta,
        });
      }
    });
    return res.status(200).json(listaClientes);
  }

  return res
    .status(404)
    .json({ messagem: `Cliente com ID : ${IDCliente} não existe` });
});
// - Os usuários poderão atualizar o dia de sua consulta - ( tendo mais consultas também temos que ter o ID da consulta que gostaria alterar a data)
app.patch('/clientes/:idCliente/consulta/:idConsulta', (req, res) => {});
// - Poderei adicionar novos usuários ao sistema do consultório - DONE
app.post('/clientes/add', (req, res) => {
  const { nome_cliente, pet } = req.body;

  const IDNovo = recebeUltimoID();

  const novoClienteComID = {
    id: IDNovo,
    nome_cliente: nome_cliente,
    pet: pet,
    procedimentos: [],
  };
  listaClientes.push(novoClienteComID);
  return res.json(novoClienteComID);
});
// - Poderei cancelar uma consulta na lista de consultas - ( mandar o ID da consulta daquele cliente que quer cancelar) || Se quiser manter o histórico das consultas adicionar uma flag: status à consulta. Ex: cancelada , pendente, finalizada...
// - Posso alterar informações do usuário - ( preciso do ID do usuário para saber qual usuário vai ser atualizado)
// - Posso pegar as consultas marcadas desse cliente -  (listar todas as consultas desse cliente rota GET cliente/{ID}/consultas) // FILTRO POR MAIS RECENTES CABE ADICIONAR AQUI a lib momento.js é boa para manipular dados.
app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});
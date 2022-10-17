const express = require('express');
const app = express();
const port = 3333;
const listaClientes = require('./model/consultas-clientes.json');

app.use(express.json());


// - Os usuários conseguiram marcar uma consulta - DONE


// - Os usuários poderão atualizar o dia de sua consulta - ( tendo mais consultas também temos que ter o ID da consulta que gostaria alterar a data) - DONE

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
// - Posso alterar informações do usuário - ( preciso do ID do usuário para saber qual usuário vai ser atualizado) - DONE

// - Posso pegar as consultas marcadas desse cliente - DONE


app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});

- Os usuários conseguiram marcar uma consulta
- Os usuários poderão atualizar o dia de sua consulta
- Poderei adicionar novos usuários ao sistema do consultório
- Poderei cancelar uma consulta na lista de consultas
- Posso alterar informações do usuário
- Posso pegar as consultas marcadas desse cliente
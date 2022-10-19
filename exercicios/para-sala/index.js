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

//- Os usuários conseguiram marcar uma consulta -- se tiver mais uma consulta

//- Os usuários poderão atualizar o dia de sua consulta
//- Poderei adicionar novos usuários ao sistema do consultório
app.post("/cliente/add",(req, res )=>{
    const { nome_cliente, pet } = req.body;
    const IDNovo= recebeUltimoID()
    const novoClienteComID = {
        id: IDNovo,
       nome_cliente: nome_cliente,
        pet: pet,
        procedimento: '',
        data_procedimento: '',
      };
   listaClientes.push(novoClienteComID);
    return res.json(novoClienteComID);
})
//- Poderei cancelar uma consulta na lista de consultas
//- Posso alterar informações do usuário
//- Posso pegar as consultas marcadas desse cliente

app.listen(port, () =>{
    console.log(` A API está rodando na porta ${port}`)
});
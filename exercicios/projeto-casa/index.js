/*Criar os clientes do banco - DONE
- Atualizar informações desses clientes ( como endereço, telefone de contato...) - DONE
- Fazer depósitos / pagamentos usando o saldo de sua conta
- Encerrar contas de clientes - DONE
- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... - Done*/ 
const express = require('express');
const app = express();
const port = 3555;
const listaClientes = require('./model/contas-clientes.json');
const uuid = require('uuid');

app.use(express.json());


// - Criar os clientes do banco - DONE
app.post('/novocliente', (req, res) => {
  const { nome_cliente, cpf_cliente, data_nascimento, conta: {tipo}} = req.body;
  const novoId = uuid.v4();
  const novoNumero = Math.floor(Math.random() * 1000000)
  const novoCliente = {
    id: novoId,
    nome_cliente: nome_cliente,
    cpf_cliente: cpf_cliente,
    data_nascimento: data_nascimento,
    conta: {
      numero: novoNumero,
      tipo: tipo,
      saldo: 0,
      data_criacao: new Date()
    }}
    listaClientes.push(novoCliente)
    return res.json(novoCliente)
    
}
)
// - Conseguir Filtrar os clientes do banco pelo seu nome- Done
app.get('/cliente/:nome_cliente', (req, res) => {
  const nomeCliente = req.params.nome_cliente;

  const clienteExiste = listaClientes.find(
    (cliente) => cliente.nome_cliente == nomeCliente
  );
  if (clienteExiste) {
    return res.status(200).json(clienteExiste);
  }
  return res.status(404).json({ messagem: 'Cliente não existe' });
});
// - Conseguir Filtrar os clientes do banco pelo seu CPF - DONE
app.get('/cliente/cpf/:cpf_cliente', (req, res) => {
  const cpfCliente = req.params.cpf_cliente;

  const clienteExiste = listaClientes.find(
    (cliente) => cliente.cpf_cliente == cpfCliente
  );
  if (clienteExiste) {
    return res.status(200).json(clienteExiste);
  }
  return res.status(404).json({ messagem: 'Cliente não existe' });
});
//- Atualizar informações desses clientes ( como endereço, telefone de contato...) - DONE
app.patch('/cliente/:id', (req, res) => {
  const idCliente = req.params.id;
  const novoTipo = req.body;
  const existeCliente = listaClientes.find((cliente) => cliente.id == idCliente);

  if(existeCliente){
    const atualizaTipoConta = {
        ...existeCliente,
        ...novoTipo
    }
     listaClientes.map((cliente, index)=>{
        if(cliente.id == idCliente){
            return listaClientes[index] = atualizaTipoConta 
          }
        });
  return res.status(200).json(atualizaTipoConta)
      }
  return res.status(404).json({ messagem: 'Cliente não existe' });
})
//- Encerrar contas de clientes - DONE
app.delete('/cliente/:id', (req, res) => {
  const idCliente = req.params.id;
  const existeCliente = listaClientes.find((cliente) => cliente.id == idCliente);
  if (existeCliente){
    listaClientes.map((cliente, index) => {
      if (cliente.id == idCliente){
        return listaClientes.splice(index, 1)
      }
    })
    return res.status(200).json({mensagem: `O cliente ${existeCliente.nome_cliente} foi excluido`}) 
  } 
    return res.status(404).json({ messagem: 'Cliente não existe' });
})
//- Fazer depósitos / pagamentos usando o saldo de sua conta
app.patch('/cliente/:id/deposito', (req, res) => {
  const idCliente = req.params.id;
  const {deposito} = req.body;
  const existeCliente = listaClientes.find((cliente) => cliente.id == idCliente);
  if(existeCliente){
    const realizaDeposito = {
      ...existeCliente.conta,
    saldo: existeCliente.conta.saldo + deposito}
    listaClientes.map((cliente, index)=>{
      if(cliente.id == idCliente){
          return listaClientes[index].conta = realizaDeposito
        }
      })
      return res.status(200).json({mensagem: `O deposito foi realizado. Novo saldo: ${realizaDeposito.saldo}`});    
}

return res.status(404).json({ messagem: 'Cliente não existe' });
}
)

app.listen(port, () => {
  console.log(`Pelos poderes da Motomami. A API está rodando na porta ${port}`);
});

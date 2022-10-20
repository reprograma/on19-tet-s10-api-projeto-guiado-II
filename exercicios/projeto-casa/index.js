const express = require('express');
const app = express();
const port = 3030 ;
const uuid = require ('uuid')
const moment = require('moment')
const listaClientesBanco = require('./model/contas-clientes.json')

app.use(express.json());

//- Criar os clientes do banco  -

app.post('/clientes/add', (req, res) => {
  const { nome_cliente, cpf_cliente, data_nascimento, conta:{numero, tipo,saldo,data_criacao}} = req.body;
  const IDUnico = uuid.v4();
  const numeroConta = Math.random();;
  const dataCriacao = moment().format('DD/MM/YYYY');

  const existeCPF = listaClientesBanco.find(
    (conta) => conta.cpf_cliente == cpf_cliente
  );
    if(!existeCPF){
      const novaContaComID = {
        id: IDUnico,
        nome_cliente,
        cpf_cliente,
        data_nascimento,
          conta:{numero:numeroConta,
            tipo,
            saldo,
            data_criacao:dataCriacao
        }
    }
    listaClientesBanco.push(novaContaComID);
    return res.status(201).json(novaContaComID);
  }
  return res.status(404).json({ messagem: 'Cliente já existe' });
  });

//- Atualizar informações desses clientes ( como endereço, telefone de contato...) 

//- Fazer depósitos / pagamentos usando o saldo de sua conta - 

app.patch('/clientes/:id/deposito', (req,res)=>{
  const idCliente = req.params.id;
  const { deposito } = req.body;

  const clienteExiste = listaClientesBanco.find(
    (cliente) => cliente.id == idCliente
  );

  if (clienteExiste) {
    const transacaoDeposito = {
      ...clienteExiste.conta,
      saldo: clienteExiste.conta.saldo + deposito,
    };
   
    listaClientesBanco.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBanco[index].conta = transacaoDeposito;
      }
    });
    return res.status(200).json({
      message: `O depósito foi realizado com sucesso.Saldo R$ ${transacaoDeposito.saldo}`,
  })
}  
  return res.status(404).json({ messagem: 'Usuário não existe' });  
})

app.patch('/clientes/:id/pagamento', (req,res)=>{ 
  const idCliente = req.params.id;
  const { pagamento } = req.body;

  const clienteExiste = listaClientesBanco.find(
    (cliente) => cliente.id == idCliente
  );

  if (clienteExiste.conta.saldo >= pagamento) {
    const transacaoPagamento = {
      ...clienteExiste.conta,
      saldo: clienteExiste.conta.saldo - pagamento
    };

    listaClientesBanco.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBanco[index].conta =  transacaoPagamento
      }
    });
    return res.status(200).json({
      message: `O pagammento foi realizado com sucesso.Saldo R$ ${transacaoPagamento.saldo.toFixed(2)}`,
  })
  }
return res.status(404).json({ messagem: 'Saldo insuficiente' });  
})

//- Encerrar contas de clientes -  http://localhost:3030/clientes/e0077787-42c1-4c0d-945b-b16787951446
app.delete("/clientes/:id",(req,res)=>{
  const idCliente = req.params.id

  const clienteExiste = listaClientesBanco.find((user)=> user.id == idCliente)

  if(clienteExiste){
      listaClientesBanco.map((cliente,index)=>{
          if(cliente.id == idCliente){
              return listaClientesBanco.splice(index,1)
          }
          
      })
      return res.status(200).json({
         message:`O usuário ${clienteExiste.nome_cliente} foi deletado com sucesso`})
  }
  return res.status(404).json({
      message:"Cliente não foi encontarado"
  })
})

//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

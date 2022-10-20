const express = require('express');
const app = express();
const port = 3333;
const uuid = require('uuid');
const listaUsers = require('./model/contas-clientes.json');
const moment = require('moment');

app.use(express.json());

app.get('/users', (req, res) => {//rota get pata listar todos os clientes:conferir criação e exclusão
  res.json(listaUsers)
});
     
app.get('/consultas', (req, res) => { // consulta por nome e cpf
  const filtroNome = req.query.nome_cliente;
  const filtroCPF = req.query.cpf_cliente;
  
  const userExiste = listaUsers.find((user) => {
      if (filtroNome) {
            return user.nome_cliente.toLowerCase() == filtroNome.toLowerCase()
          }
       if (filtroCPF) {
            return user.cpf_cliente == filtroCPF
          } 

       return res.status(404).json({ messagem: 'Usuário não existe' })
      })

  return res.json(userExiste)
  
});

app.get('/contas', (req, res) => { // consulta por nome e cpf
  const tipoConta = req.query;

  const userExiste = listaUsers.find((user) => {
    const tipoConta = listaUsers.reduce((acumulador,user) => {
      if (!acumulador[user.conta.tipo]) {
              (acumulador[user.conta.tipo]) = [];
          }
        (acumulador[user.conta.tipo]).push(user);
        return acumulador;
      }, {})
      return res.status(200).json(tipoConta)
    })
});

app.post('/users/add', (req, res) => { // cadastrando novos clientes
    const {nome_cliente, cpf_cliente, data_nascimento, contato, endereço, telefone, conta, numero, tipo, saldo, data_criacao}= req.body;
    
    const uniqueRandomID = uuid.v4()
    const dataCriacaoconta = moment().format('l')

    const novoClienteIDUnico = {
      id: uniqueRandomID,
      nome_cliente: nome_cliente,
      cpf_cliente: cpf_cliente,
      data_nascimento: data_nascimento,
      contato:contato,
       endereço: endereço,
       telefone: telefone,
      conta: conta, 
        numero: numero,
        tipo: tipo,
        saldo: saldo,
        data_criacao: dataCriacaoconta
      }
    
    listaUsers.push(novoClienteIDUnico);
    return res.json(novoClienteIDUnico);
    
  });

  app.put("/users/cpf",(req, res) => { // atualizando cadastro
    const cpfUsuario = req.body.cpf_cliente
    const cadastroAtualizado = req.body

    const userExiste = listaUsers.find(user => user.cpf_cliente == cpfUsuario)

    if(userExiste){
      listaUsers.map((user, index)=>{
            if(user.cpf_cliente == cpfUsuario){
                return listaUsers[index] = cadastroAtualizado
            }
        })
        return res.status(200).json(cadastroAtualizado)
    }
    listaUsers.push(cadastroAtualizado)
    return res.status(201).json(listaUsers)    
});

app.patch("/atualiza",(req, res)=>{
  const cpfUsuario = req.query.cpf_cliente;
  const novosDados = req.body;

  const existeUsers = listaUsers.find(user => user.cpf_cliente === cpfUsuario)

  if(existeUsers) {
      const usuarioAtualizado = {
          ...existeUsers,
          ...novosDados
      }
      listaUsers.map((user, index)=>{
          if(user.cpf_cliente == cpfUsuario){
              return listaUsers[index] = usuarioAtualizado
          }
      })
    return res.status(200).json(usuarioAtualizado)
  }
  return res.status(404).json({message:"CPF não foi encontrado"})
})

app.patch("/deposito",(req, res)=>{
  const cpfUsuario = req.query.cpf_cliente;
  const novoSaldo = req.body;

  const existeUsers = listaUsers.find(user => user.cpf_cliente === cpfUsuario)

  if(existeUsers) {
      const saldoAtualizado = {
          ...existeUsers.conta,
          saldo: novoSaldo.conta.saldo + 1000,
      }
      listaUsers.map((user, index)=>{
          if(user.cpf_cliente == cpfUsuario){
              return listaUsers[index] = saldoAtualizado
          }
      })
    return res.status(200).json(saldoAtualizado)
  }
  return res.status(404).json({message:"CPF não foi encontrado"})
})

app.patch("/saque",(req, res)=>{
  const cpfUsuario = req.query.cpf_cliente;
  const novoSaldo = req.body;

  const existeUsers = listaUsers.find(user => user.cpf_cliente === cpfUsuario)

  if(existeUsers) {
      const saldoAtualizado = {
          ...existeUsers.conta,
          saldo: novoSaldo.conta.saldo - 2000,
      }
      listaUsers.map((user, index)=>{
          if(user.cpf_cliente == cpfUsuario){
              return listaUsers[index] = saldoAtualizado
          }
      })
    return res.status(200).json(saldoAtualizado)
  }
  return res.status(404).json({message:"CPF não foi encontrado"})
})


app.delete("/conta",(req, res)=>{
  const cpfUser = req.query.cpf_cliente;

  const userExiste = listaUsers.find(user => user.cpf_cliente == cpfUser)
   if(userExiste){
      listaUsers.map((user, index)=>{
          if(user.cpf_cliente === cpfUser){
              return listaUsers.splice(index,1)
          }
      })

      return res.status(200).json({message:"Conta encerrada com sucesso!"})
  }

  return res.status(404).json({message:"Usuário não existe"})
})

app.listen(port, () => {
  console.log(`API está rodando na porta ${port}`);
});
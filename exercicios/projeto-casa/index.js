const express = require('express')
const app = express()
const port = 3333
const clientesBancarios = require('./model/contas-clientes.json')
const { v4: uuidv4 } = require('uuid')

app.use(express.json)
//console.log(uuidv4())

// Criar os clientes do banco
app.post('/clientes/novo', (req, res) => {
  const { nome_cliente, cpf_cliente, data_nascimento, conta } = req.body
  const idCliente = uuidv4()

  const cadastraCliente = {
    id: idCliente,
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta
  }
  //console.log(cadastraCliente)
  clientesBancarios.push(cadastraCliente)
  return res.json(cadastraCliente)
})
// Atualizar informações desses clientes ( como endereço, telefone de contato...)
// Fazer depósitos / pagamentos usando o saldo de sua conta
// Encerrar contas de clientes
// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

app.listen(port, () => {
  console.log('API is ON, baby!!')
})

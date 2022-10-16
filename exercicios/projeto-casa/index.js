const express = require('express')
const app = express()
const port = 3333
const listaClientesBancarios = require('./model/contas-clientes.json')
const { v4: uuidv4 } = require('uuid')

app.use(express.json)
//console.log(uuidv4())

// Criar os clientes do banco
app.post('/clientes/novo', (req, res) => {
  const { nome_cliente, cpf_cliente, data_nascimento, conta } = req.body
  //const idCliente = uuidv4()

  const cadastraCliente = {
    id: uuidv4(),
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta
  }
  listaClientesBancarios.push(cadastraCliente)
  return res.status(201).json(cadastraCliente)
})
// Atualizar informações desses clientes ( como endereço, telefone de contato...)
// Fazer depósitos / pagamentos usando o saldo de sua conta

// Encerrar contas de clientes
app.delete('/clientes/:id', (req, res) => {
  const idCliente = req.params.id
  const deletarCliente = listaClientesBancarios.find(
    cliente => cliente.id == idCliente
  )

  if (deletarCliente) {
    listaClientesBancarios.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBancarios.splice(index, 1)
      }
    })
    return res.status(200).json(listaClientesBancarios)
  }
  return res.status(404).json({ message: 'Cliente não encontrado!!' })
})
// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

app.listen(port, () => {
  console.log('API is ON, baby!!')
})

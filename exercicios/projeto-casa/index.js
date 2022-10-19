const express = require('express')
const app = express()
const port = 3333
const listaClientesBancarios = require('./model/contas-clientes.json')
const { v4: uuidv4 } = require('uuid')

app.use(express.json())

// Listar clientes do banco
app.get('/clientes', (req, res) => {
  res.send(listaClientesBancarios)
})

//Mostrar detalhes do cliente
app.get('/clientes/:id', (req, res) => {
  const id = req.params.id

  const detalhesCliente = listaClientesBancarios.filter(
    (item, index) => item.id == id
  )
  res.json(detalhesCliente)
})

// Criar os clientes do banco
app.post('/clientes/novo', (req, res) => {
  const { nome_cliente, cpf_cliente, data_nascimento, conta } = req.body
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
app.patch('/clientes/:id', (req, res) => {
  const idCliente = req.params.id
  const enderecoAtualizado = req.body
  const telefoneAtualizado = req.body

  const existeCliente = listaClientesBancarios.find(
    cliente => cliente.id == idCliente
  )

  if (existeCliente) {
    const clienteAtualizado = {
      ...existeCliente,
      ...enderecoAtualizado,
      ...telefoneAtualizado
    }

    listaClientesBancarios.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBancarios[index] = clienteAtualizado
      }
    })
    return res.status(200).json({ cliente: clienteAtualizado })
  }
  return res.status(404).json({ message: 'Cliente não existe!!' })
})

// Fazer depósitos / pagamentos usando o saldo de sua conta
app.patch('clientes/:id', (req, res) => {})

// Encerrar contas de clientes
app.delete('/clientes/:id', (req, res) => {
  const idCliente = req.params.id
  const existeCliente = listaClientesBancarios.find(
    cliente => cliente.id == idCliente
  )

  if (existeCliente) {
    listaClientesBancarios.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBancarios.splice(index, 1)
      }
    })
    return res
      .status(200)
      .json({ message: 'Cliente removido!!', cliente: existeCliente })
  }
  return res.status(404).json({ message: 'Cliente não encontrado!!' })
})
// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... [EM PROGRESS]

app.listen(port, () => {
  console.log('API is ON, baby!!')
})

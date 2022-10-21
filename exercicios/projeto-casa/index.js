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
  const {
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: { tipo, saldo }
  } = req.body
  const numeroConta = Math.floor(Math.random() * 5000000)
  const existeCPF = listaClientesBancarios.find(
    cliente => cliente.cpf_cliente == cpf_cliente
  )

  if (existeCPF) {
    return res
      .status(404)
      .json({ message: 'Existe uma conta cadastrada com esse CPF' })
  }
  const novoCliente = {
    id: uuidv4(),
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: {
      numero: numeroConta,
      tipo,
      saldo,
      data_criacao: new Date()
    }
  }
  listaClientesBancarios.push(novoCliente)
  return res.status(201).json(novoCliente)
})

// Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch('/clientes/:id/atualiza', (req, res) => {
  const idCliente = req.params.id
  const dadosAtualizados = req.body

  const existeCliente = listaClientesBancarios.find(
    cliente => cliente.id == idCliente
  )

  if (existeCliente) {
    const clienteAtualizado = {
      ...existeCliente,
      ...dadosAtualizados
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

// Fazer depósitos
app.patch('clientes/:id/deposito', (req, res) => {
  const idCliente = req.params.id
  const deposito = req.body

  const existeCliente = listaClientesBancarios.find(
    cliente => cliente.id == idCliente
  )

  if (existeCliente) {
    const novoSaldoCliente = {
      ...existeCliente.conta,
      saldo: existeCliente.conta.saldo + deposito
    }
    listaClientesBancarios.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBancarios[index] = novoSaldoCliente
      }
    })
    return res.status(202).json({
      message: 'Depósito efetuado com sucesso!',
      conta: novoSaldoCliente
    })
  }
  return res
    .status(404)
    .json({ message: 'Não é possível fazer depósito em conta inexistente' })
})

// Fazer pagamentos
app.patch('/clientes/:id/pagamento', (req, res) => {
  const idCliente = req.params.id
  const pagamento = req.body

  const existeCliente = listaClientesBancarios.find(
    cliente => cliente.id == idCliente
  )

  if (existeCliente) {
    const novoSaldo = {
      ...existeCliente.conta,
      saldo: existeCliente.conta.saldo - pagamento
    }

    listaClientesBancarios.map((cliente, index) => {
      if (cliente.id == idCliente) {
        contasClientes[index].conta = novoSaldo
      }
    })
    return res.status(200).json(novoSaldo)
  }
  if (existeCliente.conta.saldo < pagamento) {
    return res.status(404).json({ message: 'Saldo insuficiente' })
  }
})

// Encerrar contas de clientes
app.delete('/clientes/:id/delete', (req, res) => {
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
    return res.status(200).json({ message: 'Cliente removido!!' })
  }
  return res.status(404).json({ message: 'Cliente não encontrado!!' })
})
// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... [EM PROGRESS]
app.get('/clientes', (req, res) => {
  const filtroPorNome = req.query.nome
  const filtroPorSaldo = req.query.conta

  const filtroClientes = listaClientesBancarios.filter(cliente => {
    if (filtroPorNome) {
      return cliente.nome_cliente.toLowerCase() == filtroPorNome.toLowerCase()
    }
    if (filtroPorSaldo) {
      return cliente.conta.saldo == filtroPorSaldo
    }
    return cliente
  })
  res.json(filtroClientes)
})

app.listen(port, () => {
  console.log('API is ON, baby!!')
})

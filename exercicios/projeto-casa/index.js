const express = require('express')
const app = express()
const port = 3000
const { v4: uuidv4 } = require('uuid')
var moment = require('moment')
const listaClientesBanco = require('./model/contas-clientes.json')

app.use(express.json())

//- Criar os clientes do banco -- DONE
app.post('/clientes/add', (req, res) => {
  const {
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: { tipo }
  } = req.body

  const clienteUnico = listaClientesBanco.find(
    cliente => cliente.cpf_cliente == cpf_cliente
  )

  if (!clienteUnico) {
    const novoCliente = {
      id: uuidv4(),
      nome_cliente: nome_cliente,
      cpf_cliente: cpf_cliente,
      data_nascimento: data_nascimento,
      conta: {
        numero: numero,
        tipo: tipo,
        saldo: saldo,
        data_criacao: moment().format('l')
      }
    }
    listaClientesBanco.push(novoCliente)
    return res.status(201).json(novoCliente)
  }
  return res.status(404).json({
    mensagem: 'Cliente já existe'
  })
})

//- Atualizar informações desses clientes ( como endereço, telefone de contato...) -- DONE
 app.patch('/clientes/:id.', (req, res)=>{
  const idDoCliente = req.params.id
  const camposAtualizados = req.body

  const clienteExistente = listaClientesBanco.find((usuario => usuario.id == idDoCliente))

  if (clienteExistente){
    const clienteAtualizado = {
      ...clienteExistente,
      ...camposAtualizados
    }
    return res.status(200).json(clienteAtualizado)
  }
  return res.status(404).json(
    {
    messagem: "Cliente não encontrado"
    }
  )
 })


//- Fazer depósitos / pagamentos usando o saldo de sua conta
//- Encerrar contas de clientes
//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

app.listen(port, () => {
  console.log(`Api está rodando na porta ${port}`)
})

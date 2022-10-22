const express = require("express")
const app = express()
const port = 3000

const { v4: uuidv4 } = require ('uuid')

const listaClientes = require ("./model/contas-clientes.json")

app.use (express.json())

const random = (min, max) => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  }  

app.get ('/clientes', (req, res) => {
    return res.json (listaClientes)
})

// Criar os clientes do banco - DONE

app.post ('/cliente/novo', (req, res) => {
    const {nome_cliente, cpf_cliente, data_nascimento, conta} = req.body

    const faltaAlgo = []
    if (! nome_cliente) faltaAlgo.push('nome_cliente')
    if (! cpf_cliente) faltaAlgo.push('CPF')
    if (! data_nascimento) faltaAlgo.push('data_nascimento')
    if (! conta.tipo) faltaAlgo.push('conta: { tipo }')
    if (faltaAlgo.length != 0){
        const faltante = faltaAlgo.join(", ")
        return res.status(400).json({message: `Os seguintes dados obrigatório estão em branco: ${faltante}`})
    }
    const contaNova = {
        "id": uuidv4(),
        "nome_cliente": nome_cliente,
        "cpf_cliente": cpf_cliente,
        "data_nascimento": data_nascimento,
        "conta": {
            "numero": random(1, 999999), 
            "tipo": conta.tipo,
            "saldo": 0,
            "data_criacao": new Date()
        }
    }
    listaClientes.push (contaNova)
    return res.status (201).json ({message: 'Conta criada'})
})

// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... - DONE?

app.get ('/cliente', (req, res) => {
    const nomeFiltro = req.query.nome
//  const criacaoFiltro = req.query.criacao - não sei como ler data
    const contaFiltro = req.query.conta
    const saldoFiltro = req.query.saldo
//  const nascFiltro = req.query.nascimento - tbm nao sei ler essa data
    const cpfFiltro = req.query.cpf

    const clientesFiltrados = listaClientes.filter ((cliente, index) => {
        if (nomeFiltro){
            if (cliente.nome_cliente.toLowerCase().includes(nomeFiltro.toLowerCase())) return cliente
        }
        if (contaFiltro){
            if (cliente.conta.tipo.toLowerCase().includes(contaFiltro.toLowerCase())) return cliente
        }
        if (saldoFiltro){
            if (cliente.conta.saldo <= saldoFiltro) return cliente
        }
        if (cpfFiltro){
            if (cliente.conta.cpf_cliente.includes(cpfFiltro)) return cliente
        }
        
    })
    if (clientesFiltrados.length == 0){
        return res.status(404).json({message: "Nenhum cliente encontrado com o filtro usado. Para a lista completa, use o endereço: '/clientes'"})
    }
    else {
        return res.json(clientesFiltrados)
    }
})   

// Atualizar informações desses clientes ( como endereço, telefone de contato...) - DONE

app.patch ('/cliente/:id/atualizar', (req, res) => {
    const clienteID = req.params.id
    const dadosAtualizados = req.body

    const clienteExiste = listaClientes.find ( cliente => cliente.id == clienteID)
    if (clienteExiste){
        listaClientes.map ((cliente, index) => {
            if (cliente.id == clienteID){
                const infosAtualizadas = {
                    ...clienteExiste, ...dadosAtualizados
                }
                listaClientes[index] = infosAtualizadas
            }
        })
        return res.status(202).json({message:`Dados do cliente atualizados com sucesso`})
    }
    return res.status(404).json({message:"Cliente não encontrado"})
})

// Fazer depósitos / pagamentos usando o saldo de sua conta - DONE

app.patch ('/cliente/:id/saldo', (req, res) => {
    const clienteID = req.params.id
    const { operacao } = req.body

    const contaExiste = listaClientes.find((conta, index) => conta.id == clienteID)
    if (contaExiste){
        listaClientes.map ((conta, index) => {
            if (conta.id == clienteID){
                if (operacao >= 0){
                    listaClientes[index].conta.saldo += operacao
                    return res.status(202).json({message:`Saldo atual é de R$${listaClientes[index].conta.saldo}`})
                }
                else {
                    if (conta.conta.saldo < Math.abs(operacao)){
                    return res.json({message:'Saldo insuficiciente para o pagamento'})
                    }
                    else {
                        listaClientes[index].conta.saldo += operacao
                        return res.status (202).json({message:`Conta paga. Saldo restante: R$${listaClientes[index].conta.saldo}`})
                    }
                }
            }
        })
    }
    if (! contaExiste){
        return res.status (404).json({message: 'Conta não localizada'})
    }
})

// Encerrar contas de clientes - DONE

app.delete ('/cliente/:id', (req, res) => {
    const clienteID = req.params.id

    const contaExiste = listaClientes.map ((conta, index) => {
        if (conta.id == clienteID){
            const saldo = listaClientes[index].conta.saldo
            if(saldo >= 0){
                listaClientes.splice(index, 1)
                return res.status(202).json ({message:`Conta fechada. ${conta.nome_cliente} tem R$${saldo} para saque imediato`})
            }
            return res.status(401).json (`Conta não foi fechada devido à dívida de R$${Math.abs(saldo)}`)
        }
    })
    if (! contaExiste){
        return res.status(404).json({message:'Conta não localizada'})
    }
})


app.listen (port, () => {
    console.log (`API is listening on port ${port}`)
})


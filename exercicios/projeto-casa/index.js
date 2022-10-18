const express = require("express")
const app = express()
const port = 3000

const { v4: uuidv4 } = require ('uuid')

const listaClientes = require ("./model/contas-clientes.json")

app.use (express.json())


app.get ('/clientes', (req, res) => {
    return res.json (listaClientes)
})

// Criar os clientes do banco - DONE

let numeroConta = 1
app.post ('/cliente/novo', (req, res) => {
    const {nome_cliente, cpf_cliente, data_nascimento, conta} = req.body
    if (nome_cliente){
        if (cpf_cliente){
            if (data_nascimento){
                if (conta.tipo){
                    const contaNova = {
                        "id": uuidv4(),
                        "nome_cliente": nome_cliente,
                        "cpf_cliente": cpf_cliente,
                        "data_nascimento": data_nascimento,
                        "conta": {
                            "numero": numeroConta, //não entendi como pegar o número da conta, se é pra pegar em relacao as outras, pegar a maior e seguir por ali ou entao algum RNG
                            "tipo": conta.tipo,
                            "saldo": 0,
                            "data_criacao": new Date()
                        }
                    }
                    numeroConta++
                    listaClientes.push (contaNova)
                    return res.status (201).json ({message: 'Conta criada'})
                }
                return res.status(400).json('Tipo de conta não pode ficar em branco')
            }
            return res.status(400).json('Data de nascimento do cliente não pode ficar em branco')
        }
        return res.status(400).json('CPF do cliente não pode ficar em branco')
    }
    return res.status(400).json('Nome do cliente não pode ficar em branco')
})

// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

app.get ('/cliente', (req, res) => {
    const nomeFiltro = req.query.nome
//  const criacaoFiltro = req.query.criacaoFiltro - não sei como ler data
    const contaFiltro = req.query.conta
    const saldoFiltro = req.query.saldo
//  const nascFiltro = req.query.nascimento - tbm nao sei ler essa data

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
        
    })
    if (clientesFiltrados.length == 0){
        return res.status(404).json({message: "Nenhum cliente encontrado com o filtro usado. Para a lista completa, use o endereço: '/clientes'"})
    }
    else {
        return res.json(clientesFiltrados)
    }
})   

// Atualizar informações desses clientes ( como endereço, telefone de contato...)

app.patch ('/cliente/:id/atualizar', (req, res) => {
    const clienteID = req.params.id
    const dadosAtualizados = req.body

    
})

// Fazer depósitos / pagamentos usando o saldo de sua conta - DONE

app.patch ('/cliente/:id/saldo', (req, res) => {
    const clienteID = req.params.id
    const { operacao } = req.body

    const contaExiste = listaClientes.find((conta, index) => {
        if (conta.id == clienteID){
            return conta
        }
    })
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

    const contaExiste = listaClientes.find ((conta, index) => {
        if (conta.id == clienteID){
            const nome = listaClientes.nome_cliente
            const saque = listaClientes[index].conta.saldo
            if(saque >= 0){
                listaClientes[index].splice(index, 1)
                return res.status(202).json ({message:`Conta fechada. ${nome_cliente} tem R$${saldo} para saque imediato`})
            }
            saque.toString()
            return res.status(401).json (`Conta não foi fechada devido à dívida de R$${saque.toString().slice(1)}`)
        }
    })
    if (! contaExiste){
        return res.status(404).json({message:'Conta não localizada'})
    }
})


app.listen (port, () => {
    console.log (`API is listening on port ${port}`)
})


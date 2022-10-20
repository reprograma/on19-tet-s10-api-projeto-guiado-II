/* Essa API deve ser capaz de:

OK - Criar os clientes do banco - POST
OK - Atualizar informações desses clientes ( como endereço, telefone de contato...) - PATCH
OK - Encerrar contas de clientes - DELETE
OK - Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... - GET 
- Fazer depósitos / pagamentos usando o saldo de sua conta - PATCH + lógica

*/

const express = require('express')
const app = express()
const port = 3000

//número random ID:
const {v4: uuidv4} = require('uuid');
const valorID = uuidv4();

//Data
const moment = require('moment');

//chamar lista de clientes:
const listaDeClientes = require("./model/contas-clientes.json")
//interpretar json:
app.use(express.json()) 

// >>> [X] Criar os clientes do banco: (POST - cria um recurso novo)

app.post("/clientes/add", (req, res) => {
    const {nome_cliente, cpf_cliente, data_nascimento, conta} = req.body;

    const temCliente = listaDeClientes.find(cliente => cliente.cpf_cliente == cpf_cliente)

    if (temCliente) {
        return res.status(400).json({
            message: "O cliente " + nome_cliente + " com o cpf: " + cpf_cliente + " já está cadastrado."
        })
    } else {
    const novoClienteComID = {
        id: valorID,
        nome_cliente,
        cpf_cliente,
        data_nascimento,
        conta:{
            numero: Math.random(),
            tipo: conta.tipo,
            saldo: 0,
            data_criacao: moment().format('L'),
        }
    }
    listaDeClientes.push(novoClienteComID)

    res.status(201).json({ // 201 criado
        message: `Novo cliente: ${nome_cliente}, cadastrado com sucesso!`,
        listaAtual: listaDeClientes
    }) 
}})

//>>> [X] Atualizar informações desses clientes ( PATCH )
app.patch("/clientes/atualizar/:id", (req, res) => {
    const IDcliente = req.params.id
    const novosCampos = req.body

    const existeCliente = listaDeClientes.find(cliente => cliente.id == IDcliente)

    if (existeCliente) {
        const AddNovosCamposCliente = {
            ...existeCliente,
            ...novosCampos
        }

        return res.status(200).json(AddNovosCamposCliente)
    }
        return res.status(404).json({
            message: "Cliente não encontrado"
        })
})

//>>>[X] Encerrar contas de clientes ( DELETE )
app.delete("/clientes/:id", (req,res) => {
    const IDcliente = req.params.id

    const existeCliente = listaDeClientes.find((cliente) => cliente.id == IDcliente)

    if (existeCliente){
        listaDeClientes.map((cliente, index) => {
            if (cliente.id == IDcliente) {
                listaDeClientes.splice(index,1)
            }
        })
        return res.status(200).json({  //204 - excluído, mas não exibe então 200
            message: "Cliente excluído com Sucesso!",
            cliente: existeCliente
        })
}
return res.status(404).json({
    message:"Cliente não encontrado"
})
})

//>>> [X] - Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... - ( GET ) 
app.get("/clientes", (req, res) => {
     const filtroNome = req.query.nome
     const filtroSaldo = req.query.saldo

     const clientePesquisado = listaDeClientes.find((cliente, index) => {
        if (filtroNome) {
            const filtroMinusculo = filtroNome.toLowerCase()    //Tentativas para colocar o includes como insensível #fail
            const filtroInsensivel = cliente.nome_cliente.toLowerCase() == filtroMinusculo
            const filtroIncludes = cliente.nome_cliente.includes(filtroNome)
            return filtroInsensivel || filtroIncludes
        }
        if (filtroSaldo) {
            return cliente.conta.saldo == filtroSaldo
        }
        return cliente
     })
     
     if(!clientePesquisado){
        res.status(400).json({
            message: "Não localizado"
        })
     }
     res.status(200).json(clientePesquisado)
})

//>>> [ ] Fazer depósitos / pagamentos usando o saldo de sua conta - PATCH + lógica
app.patch("/clientes/pagamento/:id", (req, res) => {
    const IDcliente = req.params.id
    const valorDoPagamento = req.body

    const existeCliente = listaDeClientes.find(cliente => cliente.id == IDcliente)

    if (!existeCliente) {
        return res.status(404).json({
            message: "Cliente não encontrado"
        })
    } else {
        return res.json(existeCliente)
        // Em andamento
    }
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
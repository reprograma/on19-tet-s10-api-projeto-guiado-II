const express = require('express'); 
const app = express();
const port = 3000
const listaClientes = require("./model/contas-clientes.json")
app.use(express.json())



app.get('/listaclientes', (req, res) => {
    res.json(listaClientes)
}) 

// - Criar os clientes do banco
app.post("/cadastro",(req, res) => {
    const body = req.body
    listaClientes.push(body) // o push adiciona um novo item a array
    res.json(listaClientes)
    
})

// Atualizar informações desses clientes ( como endereço, telefone de contato...)

app.patch("clientes/:cpf_cliente", (req, res) => {
    const CPFcliente = req.params.cpf_cliente
    const atualizacao = req.body
    
    const novaListaClientes = listaClientes.map((clientes)=> {
        if(clientes.id = CPFcliente) {
            return {
                    ...clientes, ...atualizacao
            }
        }
        return clientes
    })
    res.status(200).json(novaListaClientes) //status code 200 indica que a requisição foi bem sucedida
})


// Fazer depósitos / pagamentos usando o saldo de sua conta
// Encerrar contas de clientes
// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
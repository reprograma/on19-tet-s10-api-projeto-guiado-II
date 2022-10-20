const express = require("express")
const app = express()
const port = 3000
const listaClientes = require("./model/contas-clientes.json")

app.use(express.json())

/*- Criar os clientes do banco */
app.post("/bancos/adicionarClientes", (req, res) => {
    const body = req.body
    listaClientes.push(body)

    return res.status(200).json(listaClientes)
})

/*Atualizar informações desses clientes ( como endereço, telefone de contato...)*/

app.patch("/bancos/:id", (req, res) => {
    const idCliente = req.params.id
    const novosCampos = req.body

    const existeCliente = listaClientes.find(usuario => usuario.id == idCliente)

    if (existeCliente) {
        const clienteAtualizada = {
            ...existeCliente,
            ...novosCampos
        }

        return res.status(200).json(clienteAtualizada)
    }
    return res.status(404).json({
        message: "Cliente não foi encontrado em nosso sistema, tente novamente."
    })
})

/* - Fazer depósitos / pagamentos usando o saldo de sua conta

app.patch("/bancos/:cpf", (req, res) => {
    const cpfCliente = req.params.cpf
    const existeCpf = listaClientes.find((cliente) => {
    if (cpfCliente) {

        return cliente.cpf_cliente == cpfCliente
        }
        
    })
        if(existeCpf){
            const {numero, tipo, tipo_conta,transacao_entrada,transacao_saida} = req.body;
            

            if(transacao_entrada){
                 listaClientes.map((cliente, index) => {

                    if (cliente.cpf_cliente == cpfCliente) {
                        transacao_entrada = cliente.conta.tipo.transacao_entrada
                      cliente.conta.saldo = cliente.conta.saldo + transacao_entrada;
                
                    }
                     return listaClientes[index]
                    })


                }
            }



})

*/

/* - Encerrar contas de clientes*/
app.delete("/bancos/:id", (req, res) => {
    const Idclientes = req.params.id
    const existeUsuario = listaClientes.find((usuarios) => usuarios.id == Idclientes)
    if (existeUsuario) {
        listaClientes.map((usuarios, index) => {
            if (usuarios.id == Idclientes) {
                return listaClientes.splice(index, 1)
            }
        })
        return res.status(200).json(listaClientes)
    }
    return res.status(404).json({
        message: "Cliente não Encontrado, por favor verifique."
    })

}) 

 /*  Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...*/
app.get("/bancos", (req, res) => {
    const filtrarNome = req.query.nome
    const filtrarSaldo = parseFloat(req.query.saldo)

    const clienteEscolhido = listaClientes.filter((item, index) => {

        if (filtrarNome) {
            return item.nome_cliente.toLowerCase() === filtrarNome.toLowerCase()
        }
        if (filtrarSaldo) {
            return item.conta.saldo  === filtrarSaldo
        }
        return item
    })
    res.json(clienteEscolhido)
})



app.listen(port, () => {
    console.log(`Estou escutando esta porta ${port}`)
})
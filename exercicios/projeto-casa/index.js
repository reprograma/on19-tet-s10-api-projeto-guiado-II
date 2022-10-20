const express =require("express")
const app = express()
const listaDeClientes =require("./model/contas-clientes.json")
const porta = 3001

app.use(express.json())

/*
GET- ler/recumpera -200
POST - cria -2001
PUT - edita ou cria - 202
PATCH -atualiza (um recurso espercifíco) 2002
DELETE - remove -404*/ 

//- Criar os clientes do banco -ok
//precisa de requisição
app.post("/cliente/add", (req, res)=>{

    const adicionarCliente = req.body

    listaDeClientes.push(adicionarCliente)

    return res.status(201).json(listaDeClientes)

});

//- Atualizar informações desses clientes ( como endereço, telefone de contato...) 
//precisa de um corpo de requisão-ok
app.put('/cliente/:id', (req, res) => {
    const {atualizarCliente} = req.params.id

    const existCliente = listaDeClientes.find(idCliente => idCliente.id ===atualizarCliente)
    if (existCliente ===existCliente )
    return res.status(202).json({
        id: req.body.id,
        nome_cliente: req.body.nome_cliente,
        cpf_cliente: req.body.cpf_cliente,
        data_nascimento: req.body.data_nascimento,
        conta: req.body.conta 


 })
if ( ! existCliente){
    return res.status(404).json({ massege: "Não é possível atualizar dados, desse cliente."})
}
listaDeClientes.push(existCliente)
})
    

//- Fazer depósitos / pagamentos usando o saldo de sua conta
//precisa de requisição
app.patch("/cliente/:id", (req, res)=>{
    const IdDoCliente = req.params.id
    const body = req.body

    const existeCliente = listaDeClientes.find(idCliente => idCliente.id ==IdDoCliente)
    if (existeCliente){
        const saldoAtualizado = {
            ...existeCliente.conta,
            saldo :body.conta.saldo 
        }
        listaDeClientes.map((cliente, index)=>{
            if(cliente.conta==IdDoCliente)
            return listaDeClientes[index] = saldoAtualizado
    })
    

return res.status(202).json(saldoAtualizado)
 }
if (! existeCliente){
    return res.status(404).json({massege: "Ops! dados não encontrados em nosso banco de dados."})
}}) 


//- Encerrar contas de clientes - ok
// não precisa de requisição
app.delete("/cliente/:nome", (req, res)=>{

    const buscarNomeDoCliente = listaDeClientes.find(nome => nome.nome_cliente === req.params.nome)

    if (! buscarNomeDoCliente)
    return res.status(404).json({massege: "Esse cliente  não existe"})


    if (buscarNomeDoCliente ===buscarNomeDoCliente)
    return res.status(404).json({message :"conta deletada com sucesso !"})

    const index = listaDeClientes.indexOf(buscarNomeDoCliente)
    listaDeClientes.splice(index, 1)

    return res.json(buscarNomeDoCliente)
    

})

//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
// não precisa de requisição
app.get("/cliente/:cpf", (req, res)=> {
const body= req.body
    const CpfCliente = listaDeClientes.find(Cpf => Cpf.cpf_cliente === req.params.cpf);
     
    if ( ! CpfCliente)
    return res.status(404).json({massege: "cliente não encontrado !"})

    return res.json(CpfCliente);
     
})



app.listen(porta, ()=>{
    console.log(`Aplicação rodando na porta ${porta}: http://localhost:3001/`)
})

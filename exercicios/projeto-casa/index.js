const express = require('express');
const app = express();
const port = 3333;
const listaDeClientes = require('./model/contas-clientes.json');

app.use(express.json());

app.get("/cliente",(req, res)=>{
    const filtroPorNome = req.query.nome
    const filtroPorCPF = req.query.cpf
  
    const clientesFiltrados = listaDeClientes.filter((cliente)=>{
        if(filtroPorNome){
            return cliente.nome_cliente.toLowerCase() == filtroPorNome.toLowerCase()
        }
        if(filtroPorCPF){
            return cliente.cpf_cliente == filtroPorCPF
        }
        return cliente
    })
    res.json(clientesFiltrados)
    })


app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
})
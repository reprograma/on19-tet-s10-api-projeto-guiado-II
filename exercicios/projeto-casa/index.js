

const express = require('express')
const app = express() //chama o express, função que engloba os metodos do express 
const port = 3000 //declarando a porta
const listaDeClientes = require("./model/contas-clientes.json");

app.use(express.json()); //para mandar e receber json, chama app.user que cria um intercepto para fazer o body-parser do corpo da requição e resposta 


// Criar os clientes do banco 
app.post("/clientes/add", (req, res) => {  //rota para criar usuario novos
    const { nome_cliente, cpf_cliente, data_nascimento, email, conta } = req.body;
    const novoID = req.body

    const novoCliente = {
        id, 
        nome_cliente,
        cpf_cliente,
        cliente,
        data_nascimento,
        conta:{
        numero:Math.floor(Math.random() * 100),
        tipo ,
        data_criação: hoje.toISOString(),
    
    },
    }
    contasClientes.push(novoCliente)
    return res.json(novoCliente)

  });

  //- Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch("/clientes/:id/atualizarnumero", (req, res) => {

    const clienteID = req.params.id;
    const { telefone } = req.body;

    const existeCliente = contasClientes.find(
      (cliente) => cliente.id == clienteID
    );

    if (existeCliente) {
      const clienteAtualizado = {
        ...existeCliente,
        telfone_cliente: telefone,
    };

    contasClientes.map((cliente, index) => {
      if (cliente.id == idCliente) {
        contasClientes[index] = clienteAtualizado;
      }
    });
    return res.status(200).json(contasClientes);
  }
  return res.status(400).json({ messagem: "Cliente não encontrado" });
});

//Encerrar contas de clientes ( DELETE )
const deleteconta = (request, response) => {
    const clienteID = request.params.id
    const existeCliente = cliente.findIndex(cliente => cliente.id == idCliente)
    splice(clienteEncontrada, 1)

    response.status(200).json({
        "mensagem": "conta excluída com sucesso",
        
    })
    
}
// Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
app.get("/cliente",(req, res)=>{
    const filtrarPorNome = req.query.nome
    const filtraPorTipoConta = req.query.tipoConta?.toLowerCase()

    const clientesFiltrados = listaClientesBanco.filter((cliente)=>{
        if(filtrarPorNome){
            return cliente.nome_cliente.toLowerCase() == filtroNome.toLowerCase()
        }
        if(filtraPorTipoConta){
            return cliente.saldo_cliente == filtrosaldo
        }
        return cliente
    })
    res.json(clientesFiltrados)
    })


app.listen(port,()=>{
    console.log(`Api esta rodando na porta ${port}`);
  })
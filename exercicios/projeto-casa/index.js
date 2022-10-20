const express = require('express');
const app = express();
const port = 3000
const { v4: uuidv4 } = require('uuid')
//const novaConta = Math.floor(Math.random()* 5194728);
const listaClientes = require('./model/contas-clientes.json');
app.use(express.json());

app.get('/clientes', (req, res) =>{
  res.send(listaClientes)
})


// - banco

app.post('/clientes/add', (req, res) => {
    const { nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: {tipo, saldo}
} = req.body;

    const IDUnico = uuidv4();

    const novoCliente = {
      id: IDUnico,
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: {
        numero : novaConta ,
        tipo,
        saldo,
        data_criacao: new Date,
      } 
    };

    listaClientes.push(novoCliente);
    return res.json(novoCliente);
  });

  // Atualizar informações 

  app.patch("/clientes/:id",(req, res)=>{
    const IDCliente = req.params.id
    const novosCampos = req.body

    const acharUsuario = listaClientes.find(clientes => clientes.id == IDCliente)

    if(acharUsuario) {
        const usuarioAtualizado = {
            ...acharUsuario,
            ...novosCampos
        }

        listaClientes.map((clientes, index)=>{
            if(clientes.id == IDCliente){
                return listaClientes[index] = usuarioAtualizado
            }
        })
        console.log(usuarioAtualizado)
        return res.status(200).json(usuarioAtualizado)
    }
    return res.status(404).json({message:"Usuario não encontrado"})

})

//Fazer depósitos / pagamentos

  app.patch("/conta/:id/deposito", (req, res) => {
    const { deposito } = req.body;
    const IDCliente  = req.params.id;

    const acharCliente = listaClientes.find((cliente) => cliente.id == IDCliente)

    if(acharCliente) {
      const opDeposito = {
        ...acharCliente.conta,
        saldo:acharCliente.conta.saldo + deposito,
      }
      listaClientes.map((cliente, index) =>{
        if (cliente.id == IDCliente){
          return listaClientes[index] = opDeposito
    }
    })
    return res.status(200).json(opDeposito)
  }
    return res.status(404).json("Não foi possivel localizar o usuario ");
  })

  //Encerrar contas 

  app.delete("/clientes/:id",(req,res)=>{
    const idCliente = req.params.id

    const locCliente = listaClientes.find((user)=> user.id == idCliente)

    if(locCliente){
        listaClientes.map((cliente,index)=>{
            if(cliente.id == idCliente){
                return listaClientes.splice(index,1)
            }

        })
        return res.status(200).json({
           message:`O usuário ${locCliente.nome_cliente} foi retirado do banco de dados com sucesso`})
    }
    return res.status(404).json({
        message:"Cliente não foi encontrado"
    })
  })

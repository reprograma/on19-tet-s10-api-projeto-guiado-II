const express = require('express');
const app = express()
const port = 3000
const contasClientes = require("./model/contas-clientes.json");


app.use(express.json())
//- Criar os clientes do banco
app.post("/clientes/add",(req,res) => {
    const {id,nome_cliente, cpf_cliente, cliente,data_nascimento,conta:{numero,tipo,saldo,data_criação}} = req.body;
    const hoje = new Date();
const novoID = req.body

    const novoCliente = {
        id, 
        nome_cliente,
        cpf_cliente,
        cliente,
        data_nascimento,
conta:{
        numero:Math.random(),
        tipo ,
        saldo,
        data_criação :hoje.toISOString(),

},
    }
contasClientes.push(novoCliente)
return res.json(novoCliente)

});
//- Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch("/clientes/:id/atualizarnumero", (req, res) => {
    
        const idCliente = req.params.id;
        const { telefone } = req.body;
      
        const clienteExiste = contasClientes.find(
          (cliente) => cliente.id == idCliente
        );
      
        if (clienteExiste) {
          const clienteAtualizado = {
            ...clienteExiste,
            telfone_cliente: telefone,
          };
      
          contasClientes.map((cliente, index) => {
            if (cliente.id == idCliente) {
              contasClientes[index] = clienteAtualizado;
            }
          });
          return res.status(200).json(contasClientes);
        }
        return res.status(404).json({ messagem: "Cliente não encontrado" });
      });
//- Fazer depósitos / pagamentos usando o saldo de sua conta
app.patch("/conta/:id/deposito", (req, res) => {
    const idCliente = req.params.id;
    const { deposito } = req.body;
  
    const clienteExiste = contasClientes.find(
      (cliente) => cliente.id == idCliente
    );
  
    if (clienteExiste) {
      const efetuarDeposito = {
        ...clienteExiste.conta,
        saldo: clienteExiste.conta.saldo + deposito,
      };
  
      contasClientes.map((cliente, index) => {
        if (cliente.id == idCliente) {
          contasClientes[index].conta = efetuarDeposito;
        }
      });
      return res.status(200).json(contasClientes);
    }
    return res.status(404).json({ messagem: "Cliente não encontrado" });
  });
  
 // - Encerrar contas de clientes
 app.delete("/clientes/:cpf_cliente",(req, res)=>{
    const cpfCliente = req.params.cpf_cliente
    
    const existeCliente = contasClientes.find(cliente => cliente.cpf_cliente == cpfCliente)

    if(existeCliente){
        contasClientes.map((cliente, index)=>{
            if(cliente.cpf_cliente == cpfCliente){
                contasClientes.splice(index,1)
            }
        })

        return res.status(200).json({
            message:`A conta do CPF ${cpfCliente} foi encerrada`,
            cliente: existeCliente
        }
        )
    }

    return res.status(404).json({ 
        message:`Não foi possível uma conta com o CPF  ${cpfCliente} informaddo `
    })
})

//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
app.get("/cliente",(req, res)=>{
    const filtroNome = req.query.nome
    const filtrosaldo = req.query.saldo
    
    const clientesFiltrados = listaClientes.filter((cliente)=>{
        if(filtroNome){
            return cliente.nome_cliente.toLowerCase() == filtroNome.toLowerCase()
        }
        if(filtrosaldo){
            return cliente.saldo_cliente == filtrosaldo
        }
        return cliente
    })
    res.json(clientesFiltrados)
    })


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
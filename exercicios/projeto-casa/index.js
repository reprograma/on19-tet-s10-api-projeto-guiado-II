const express = require('express');
const app = express();
const port = 3000;
const contasClientes = require('./model/contas-clientes.json');
const { v4: uuidv4 } = require('uuid');
const novaConta = Math.floor(Math.random() * 1000);

app.use(express.json());




//Criar os clientes do banco
app.post("/conta/add", (req, res) => {
    const {
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: { tipo, saldo }
    } = req.body;
    const existeContaComCpf = contasClientes.find(
      (conta) => conta.cpf_cliente == cpf_cliente
    );
  
    if (!existeContaComCpf) {
      const novoClienteComCpf = {
        id: uuidv4(),
        nome_cliente,
        cpf_cliente,
        data_nascimento,
        conta: {
          numero: novaConta,
          tipo,
          saldo,
          data_criacao: new Date(),
        },
      };
      contasClientes.push(novoClienteComCpf);
      return res.status(201).json(novoClienteComCpf);
    }
    return res.status(404).json({
      messagem: `Cliente com CPF: ${cpf_cliente} já possui conta cadastrada neste Banco`,
    });
  });

//- Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch("/clientes/atualiza/:id",(req, res)=>{
    const idCliente = req.params.id;
    const {endereco} = req.body;
    const {telefone} = req.body;
  
    const existeCliente = contasClientes.find(user => user.id == idCliente)
  
    if(existeCliente) {
        const usuarioAtualizado = {
            ...existeCliente,
        endereco,
        telefone,
            }
        
        contasClientes.map((user, index)=>{
            if(user.id == idCliente){
                return contasClientes[index] = usuarioAtualizado
            }
        })
      return res.status(200).json(usuarioAtualizado)
    }
    return res.status(404).json({message:"ID não foi encontrado"})
  })
  
  //- Fazer depósitos / pagamentos usando o saldo de sua conta
  //Deposito
  app.patch("/clientes/:id/deposito", (req,res)=>{
    const idCliente = req.params.id;
    const { deposito } = req.body;

    const existeCliente = contasClientes.find(
      (cliente) => cliente.id == idCliente
    );

    if (existeCliente) {
      const fazDeposito = {
        ...existeCliente.conta,
        saldo: existeCliente.conta.saldo + deposito,
      };

      contasClientes.map((cliente, index) => {
        if (cliente.id == idCliente) {
          contasClientes[index].conta = fazDeposito ;
        }
      });
      return res.status(200).json({
        message: `Depósito do cliente ${existeCliente.nome_cliente} realizado com sucesso. Saldo ${fazDeposito.saldo}`,
    })
  }  
    return res.status(404).json({ messagem: "Cliente não encontrado"});  
  })
//Saque
app.patch("/clientes/:id/saque", (req,res)=>{
  const idCliente = req.params.id;
  const { saque } = req.body;

  const existeCliente = contasClientes.find(
    (cliente) => cliente.id == idCliente
  );

  if (existeCliente.conta.saldo >= saque) {
    const fazSaque = {
      ...existeCliente.conta,
      saldo: existeCliente.conta.saldo - saque,
    };

    contasClientes.map((cliente, index) => {
      if (cliente.id == idCliente) {
        contasClientes[index].conta = fazSaque ;
      }
    });
    return res.status(200).json({
      message: `Saque do cliente ${existeCliente.nome_cliente} realizado com sucesso. Saldo ${fazSaque.saldo}`,
  })
}  
  return res.status(403).json({ messagem: "Saldo insuficiente"});  
})

//- Encerrar contas de clientes
app.delete("/clientes/:id",(req, res)=>{
    const idCliente = req.params.id
    
    const existeCliente = contasClientes.find(cliente => cliente.id == idCliente )

    if(existeCliente){
        contasClientes.map((cliente, index)=>{
            if(cliente.id == idCliente ){
                contasClientes.splice(index,1)
            }
        })

        return res.status(200).json({
            message:"Cliente apagado com sucesso",
            cliente: existeCliente
        }
        )
    }

    return res.status(404).json({ 
        message:`Não foi possível apagar o usuário, pois não foi encontrado`
    })
})


//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
app.get("/cliente",(req, res)=>{
const filtroNome = req.query.nome
const filtroSaldo = req.query.saldo

const clientesFiltrados = contasClientes.filter((cliente)=>{
    if(filtroNome){
        return cliente.nome_cliente.toLowerCase() == filtroNome.toLowerCase()
    }
    if(filtroSaldo){
        return cliente.conta.saldo == filtroSaldo
    }
    return cliente
})
return res.status(200).json(clientesFiltrados)
})



app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
  });
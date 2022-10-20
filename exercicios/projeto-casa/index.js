const express = require('express');
const app = express();
const port = 3333;
const {v4: uuidv4 } = require("uuid");
const novaConta = Math.floor(Math.random()* 10000000);
const contasClientes = require('./model/contas-clientes.json');

app.use(express.json());

//- Criar os clientes do banco (POST)
app.post("/conta/add", (req, res)=>{
    const {
        nomeCliente,
        cpfCliente,
        dataNascimento,
        conta: {tipo, saldo},
    }
})

//- Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch("/conta/:idcliente/consulta/:tipo", (req, res)=>{
    const idCliente = req.params.id
    const {tipo: novoTipo } = req.body;

    const existeCliente = contasClientes.find(user => user.id == idCleinte);

    if (existeCliente) {
        const usuarioAtualizado = {
            ...existeCliente,
            tipo: novoTipo,
        };

        contasClientes.map((user, index)=> {
            if (user.id == idCliente) {
                listaClientes[index] = usuarioAtualizado; 
            }
            return res.status(200).json({
                message: 'O tipo de conta passou para ${existeCliente.id} e foi atualizado com sucesso.',
            });
        });
    }
    return res.status(402).json({message: "cliente não foi enccontrado"})
})

//- Fazer depósitos / pagamentos usando o saldo de sua conta
app.patch("/deposito",(req, res)=>{
    const cpfUsuario = req.query.cpf_cliente;
    const novoSaldo = req.body;
  
    const existeUsuario = listaUsuarios.find(user => user.cpf_cliente === cpfUsuario)
  
    if(existeUsuario) {
        const saldoAtualizado = {
            ...existeUsuario.conta,
            saldo: novoSaldo.conta.saldo + 2500,
        }
        listaUsuarios.map((user, index)=>{
            if(usuario.cpf_cliente == cpfUsuario){
                return listaUsuarios[index] = saldoAtualizado
            }
        })
      return res.status(200).json(saldoAtualizado)
    }
    return res.status(404).json({message:"CPF não foi encontrado"})
  }

//Encerrar contas de clientes
app.delete ("/clientes/:cpf_cliente", (req, res)=>{
    const cpfCliente = req.params.cpf_cliente
    const existeCliente = contasClientes.find(cliente => cliente.cpf_cliente == cpfCliente)

    if(existeCliente){
        contasClientes.map((cliente, index)=>{
            if(cliente.cpf_cliente == cpfCliente){
                contasClientes.splice(index,1)
            }
        })

        return res.status(200).json({
            message:" CLIENTE DELETADO COM SUCESSO",
            cliente: existeCliente
        }
        )
    }

    return res.status(404).json({ 
        message:`IMPOSSIVEL APAGAR O CLIENTE DE CPF ${cpfCliente}, CLIENTE NÃO ENCONTRADO.`
    })
})


//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
app.get('/produtos', (req, res)=>{
    const filtrarPorNome = req.query.nomeCliente
    const filtrarPorSaldo = req.query.saldo
    const filtrar = listaClientes.filter((item, index)=>{
        if (filtrarPorNome){
            return item.nomeCliente.toLowerCase() == filtrarPorNome.toLocaleLowerCase()
        }
        if (filtrarPorSaldo){
            return item.valor == filtrarPorSaldo;
        }
        return item, index
    });
    res.json
})

app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
});
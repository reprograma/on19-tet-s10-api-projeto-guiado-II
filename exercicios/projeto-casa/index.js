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
app.patch("/clientes/atualiza",(req, res)=>{
    const cpfUsuario = req.query.cpf_cliente;
    const novosDados = req.body;
  
    const existeCliente = contasClientes.find(user => user.cpf_cliente === cpfUsuario)
  
    if(existeCliente) {
        const usuarioAtualizado = {
            ...existeCliente,
            ...novosDados
        }
        contasClientes.map((user, index)=>{
            if(user.cpf_cliente == cpfUsuario){
                return contasClientes[index] = usuarioAtualizado
            }
        })
      return res.status(200).json(usuarioAtualizado)
    }
    return res.status(404).json({message:"CPF não foi encontrado"})
  })
  
  //- Fazer depósitos / pagamentos usando o saldo de sua conta
  app.patch('/clientes/:id/pagamento', (req,res)=>{ 
    const idCliente = req.params.id;
    const { pagamento } = req.body;
  
    const existeCliente = contasClientes.find(
      (cliente) => cliente.id == idCliente
    );
  
    if (existeCliente.conta.saldo >= pagamento) {
      const transacaoPagamento = {
        ...existeCliente.conta,
        saldo: existeCliente.conta.saldo - pagamento
      };
  
      contasClientes.map((cliente, index) => {
        if (cliente.id == idCliente) {
            contasClientes[index].conta =  transacaoPagamento
        }
      });
      return res.status(200).json({
        message: `O pagammento foi realizado com sucesso.Saldo R$ ${transacaoPagamento.saldo.toFixed(2)}`,
    })
    }
  return res.status(404).json({ messagem: 'Saldo insuficiente' });  
  })


//- Encerrar contas de clientes
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
            message:"Cliente apagado com sucesso",
            cliente: existeCliente
        }
        )
    }

    return res.status(404).json({ 
        message:`Não foi possível apagar o usuário com CPF ${cpfCliente} pois não foi encontrado`
    })
})


//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...
app.get("/cliente",(req, res)=>{
const filtroNome = req.query.nome
const filtroCPF = req.query.cpf

const clientesFiltrados = contasClientes.filter((cliente)=>{
    if(filtroNome){
        return cliente.nome_cliente.toLowerCase() == filtroNome.toLowerCase()
    }
    if(filtroCPF){
        return cliente.cpf_cliente == filtroCPF
    }
    return cliente
})
res.json(clientesFiltrados)
})



app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
  });
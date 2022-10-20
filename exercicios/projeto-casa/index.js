const express = require('express');
const app = express();
const port = 3333;
const listaClientes = require('./model/contas-clientes.json');

app.use(express.json());

//adicionar clientes
app.post("/conta/add", (req, res) => {
    const {
      nome_cliente,
      cpf_cliente,
      data_nascimento,
      conta: { tipo, saldo },
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
  
  
  //- Conseguir Filtrar os clientes do banco pelo seu nome ou cpf
  app.get("/cliente",(req, res)=>{
  const filtroNome = req.query.nome
  const filtroCPF = req.query.cpf
  
  const clientesFiltrados = listaClientes.filter((cliente)=>{
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


app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
});
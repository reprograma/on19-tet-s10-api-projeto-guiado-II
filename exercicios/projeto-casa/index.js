/*- Criar os clientes do banco
- Atualizar informações desses clientes ( como endereço, telefone de contato...)
- Fazer depósitos / pagamentos usando o saldo de sua conta
- Encerrar contas de clientes
- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...*/




const express = require ("express")
const app = express()
const port = 3002;
const uuid = require ("uuid")
const IDUnico = uuid.v4()
const GerarNovoNumeroConta = Math.random();
const listaClientesBanco = require("./model/contas-clientes")

app.use(express.json());


const ordenandoContasClientes = () => {
    const novaListaOrdenadaDeContas = listaClientesBanco.sort((clienteA, clienteB) => {
      if (clienteA.data_nascimento < clienteB.data_nascimento) {
        return -1;
      }
      if (clienteA.data_nascimento > clienteB.data_nascimento) {
        return 1;
      }
  
      return 0;
    });
  
    const valorUltimoID = novaListaOrdenadaDeContas[novaListaOrdenadaDeContas.length - 1];
  
    return valorUltimoID.index + 1;
    
  };
  
  console.log()

//Criar os clientes do banco, foi utilizado o método post, que (concluido)


app.post("/clientes/add",(req,res) => {
    const {id,nome_cliente, cpf_cliente, cliente,data_nascimento,
        conta:{numero,tipo,saldo,data_criação}} = req.body;
  
    const dataAberturaConta = new Date();
    const clienteNovo = ordenandoContasClientes();
    const novoCliente = {
        
        id : uuid.v4(),
        nome_cliente  ,
        cpf_cliente,
        cliente,
        data_nascimento,
conta:{
        numero:Math.random(),
        tipo ,
        saldo,
        data_criação :dataAberturaConta.toISOString(),
    
},
    }
    listaClientesBanco.push(ordenandoContasClientes)
return res.json(novoCliente)
    
});


//- Atualizar informações desses clientes ( telefone de contato e tipo de conta atualizados...(Concluido))

     
app.patch("/cliente/:id",(req,res) => {

    const idUsuario = req.params.id
    const dadoAlterado = req.body
   
 
     const  dadosCliente = listaClientesBanco.find(usuario => usuario.id == idUsuario)
     if(dadosCliente){
        const dadosAtualizados = {
            ...dadosCliente,
            ...dadoAlterado
          
        }

         listaClientesBanco.map((usuario,index) => {
            if(usuario.id == idUsuario){
                return listaClientesBanco[index] = dadosAtualizados
      }

    
     })
     return res.status(200).json(dadosAtualizados)
    
}
return res.status(404).json({message:"Cliente não encontrado"})
})

//Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...(In Progress)

 app.get("/cliente/:id",(req, res)=>{

    const idUsuario = req.params.id
    const filtroNome = req.query.nome
    const filtroSaldo = req.query.saldo

    const dadosCliente = listaClientesBanco.find((cliente)=>cliente.nome_cliente == idUsuario
    );
      if(filtroNome) {
        return idUsuario.toLowerCase() == filtroNome.toLowerCase.nome_cliente()
      }
      if(filtroSaldo) {
        return idUsuario.saldo == filtroSaldo.saldo

      }

      return res.status(200).json(dadosCliente)
              
     
    })
  






//- Encerrar contas de clientes(In Progress)




//- Encerrar contas de clientes(In Progress)



app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
  });
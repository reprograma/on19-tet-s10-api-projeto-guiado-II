const express = require('express');
const app = express();
const port = 3006;
const uuid = require('uuid')
const IDUnico = uuid.v4()
const listaClientesbanco = require('./contas-clientes.json');

app.use(express.json());
//- Criar os clientes do banco(DONE)
app.post('/clientes/add', (req, res ) =>{
const {nome_cliente, cpf_cliente, data_nascimento, conta:{numero, tipo, saldo, data_criacao}}= req.body
const novoClienteComIDunico ={
id: IDUnico,
nome_cliente: nome_cliente,
cpf_cliente: cpf_cliente,
data_nascimento: data_nascimento,
conta:{ numero: Math.random(), // numero randomico
    tipo,
    saldo,
    data_criacao: new Date().toISOString()// gera data randomica

}}
listaClientesbanco.push(novoClienteComIDunico);
return res.status(201).json(novoClienteComIDunico)
});
//- Atualizar informações desses clientes ( como endereço, telefone de contato...)(feito, fazer amanhã outro pacth para endereço)
app.patch('/cliente/:Id/consulta/:telefone', (req, res ) => {
    const idcliente= req.params.IDUnico
    const idtelefone = req.params.telefone;
   const { telefone: newNumber} =req.body // criando a varivel telefone no body do json
    const clienteExistente= listaClientesbanco.find((conta) => conta.IDUnico == idcliente); //para confirmar se o usario existe
   if(clienteExistente){
    const novotelefone = listaClientesbanco.map((conta, index)=>{ // mapa para achar o usuario e seu index e atualizar seu telefone
        if (conta.telefone != idtelefone){
          return  conta.telefone = newNumber;
        }
       return{ ...conta}
    })
    listaClientesbanco.map((clientes, index) =>{
        if (clientes.IDUnico == idcliente){
            listaClientesbanco[index].telefone = novotelefone
        }
    })
    return res.status(200).json({
        mensagem: `Telefone do cliente : ${clienteExistente.nome_cliente} foi atualizado para: ${clienteExistente.telefone[1]}`})
   }
    return res.status(404).json({mensagem: 'cliente não encontrado'});
     })







//- Fazer depósitos / pagamentos usando o saldo de sua conta
//- Encerrar contas de clientes (encerei a conta por cpf )(feito)
app.delete('/clientes/:cpf_cliente', (req, res) =>{
    const cpfCliente = req.params.cpf_cliente
    const cpfvalido = listaClientesbanco.find(usario => usario.cpf_cliente == cpfCliente)
    if (cpfvalido){
    listaClientesbanco.map((usario, index) =>{
        if (usario.cpf_cliente == cpfCliente)
        return listaClientesbanco.slice(index,1)
    })
    return res.status(202).json({mensagem:"cliente apagado com sucesso", usario: cpfvalido})
}
return res.status(404).json({mensagem: 'Este cpf não é válido, tente novamente '})
})
//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...(DONE) // tentei filtrar por saldo mas n conseguir
app.get('/clientes', (req, res) =>{ 
    const filtroNome = req.query.nome_cliente
    const filtroCpf= req.query.cpf_cliente
    const DataNasc = req.query.data_nascimento
    const filtrando = listaClientesbanco.filter((item)=>{
        if (filtroNome){
        return item.nome_cliente.toLowerCase() == filtroNome.toLowerCase()
        }
        if (filtroCpf){
        return item.cpf_cliente === filtroCpf;
        }
        if (DataNasc){
          return item.data_nascimento === DataNasc;
        }
        
        
      return item
    })
    res.json(filtrando)
}  )















app.listen(port, () =>{
    console.log(` A API está rodando na porta ${port}`)
});
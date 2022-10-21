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
    const idcliente= req.query.IDUnico
    const idtelefone = req.params.telefone;
   const { telefone: newNumber} =req.body // criando a varivel telefone no body do json
    const ClienteExiste= listaClientesbanco.find((conta) => conta.IDUnico == idcliente); //para confirmar se o usario existe
   if(ClienteExiste){
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
        mensagem: `Telefone do cliente : ${ClienteExiste.nome_cliente} foi atualizado para: ${ClienteExiste.telefone[1]}`})
   }
    return res.status(404).json({mensagem: 'cliente não encontrado'})
     })
  //nova rota para alterar endereço
app.patch('/endereco/:id', (req, res)=>{ // tentativa de fazer para achar endereço mas não rolou sorry prof, não sei onde errei tentei usar a mesma lógica do telefone
    const cpfCliente = req.params.id
    const atualizarend = req.params.edendereco
    const { endereco} = req.body
    const ClienteComIdValido = listaClientesbanco.find((conta) => conta.cpf_cliente ==cpfCliente)
    if (ClienteComIdValido){
        const novoendereco = listaClientesbanco.map((conta, index) =>{
            if (conta.endereco = atualizarend)
            return conta.endereco == endereco;
          
        })
        listaClientesbanco.map((conta, index) =>{
            if (conta.cpf_cliente != cpfCliente){
                listaClientesbanco[index].endereco = novoendereco
            }
            return res.status(200).json({mensagem: 
                `O enderenco do cliente é: ${ClienteComIdValido.nome_cliente} Foi atualizado para   ${ClienteComIdValido.atualizarend} `})
        })
    }
    return res.status(404).json({mensagem: 'cliente não encontrado'});
})
+
//- Fazer depósitos / pagamentos usando o saldo de sua conta (FEITO, Funcinou tentei fazer com req.params mas não rolou, não se poderia fazer com req.query para)
app.patch('cliente/:idCliente/deposito', (req, res ) => { 
    const SolicitaIDcliente = req.params.id// usei o query para consultar no banco se o cpf era válido
    const {valorDeposito} = req.body
    const ExisteCliente = listaClientesbanco.find((cliente) => cliente.id == SolicitaIDcliente)
    if (ExisteCliente){
       const NovoSaldoConta ={ 
        ...ExisteCliente.usario.conta,
        saldo: ExisteCliente.usario.conta.saldo + valorDeposito,
    } 
    listaClientesbanco.map((cliente, index)=>{
      if (cliente.id == SolicitaIDcliente){
        return (listaClientesbanco[index] = NovoSaldoConta)
      }
    })
    res.status(202).json(NovoSaldoConta)
} 

    return res.status(404).json({ messagem: 'Usuário não existe' }); 
})
// rota para saque(pagamento)(FEITO)
app.patch('/cliente/:idCliente/saque', (req, res) =>{
    const VerificaCpf = req.query.cpf_cliente
    const {Valor_do_saque} = req.body
    const Existecliente = listaClientesbanco.find((cliente) => cliente.cpf_cliente == VerificaCpf)
    if (Existecliente.conta.saldo >= Valor_do_saque){
        const Saque = {
            ...Existecliente.usario.conta,
            saldo: Existecliente.usario.conta.saldo - Valor_do_saque,
        }

        listaClientesbanco.map((cliente, index) =>{
            if (cliente.cpf_cliente == VerificaCpf)
            return (listaClientesbanco[index] =Valor_do_saque)
        } )
        res.status(202).json(Saque)
    }
return res.status(404).json({mensagem: "Seu saldo é insuficiente para o saque!"})
})
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
//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo...(DONE) alguns tipos de filtros
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
    res.status(200).json(filtrando)
}  )

app.listen(port, () =>{
    console.log(` A API está rodando na porta ${port}`)
});
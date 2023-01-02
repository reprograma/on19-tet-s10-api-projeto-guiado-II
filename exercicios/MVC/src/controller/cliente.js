const listaClientesBanco = require('../model/contas-clientes.json')
const uuid = require ('uuid')
const moment = require('moment')

const criaCliente = (req, res) => {
    const { nome_cliente, cpf_cliente, data_nascimento, conta:{tipo,}} = req.body;
    const IDUnico = uuid.v4();
    const numeroConta = Math.floor(Math.random() * 1000000)
    const dataCriacao = moment().format('DD/MM/YYYY');

    const existeCPF = listaClientesBanco.find(
        (conta) => conta.cpf_cliente == cpf_cliente
    );
        if(!existeCPF){
        const novaContaComID = {
            id: IDUnico,
            nome_cliente,
            cpf_cliente,
            data_nascimento,
            conta:{numero:numeroConta,
                tipo,
                saldo:0,
                data_criacao:dataCriacao
            }
        }
        listaClientesBanco.push(novaContaComID);
        return res.status(201).json(novaContaComID);
    }
    return res.status(404).json({ messagem: 'O cliente já existe' });
};

const exibeCliente = (req, res) => {
    const filtraPorNome = req.query.nome?.toLowerCase()
    const FiltraPorSaldo = req.query.saldo
    const FiltraPorTipoConta = req.query.tipoConta?.toLowerCase()

      const filtroEscolhido = listaClientesBanco.filter((conta) => {

        if(filtraPorNome){
          return conta.nome_cliente.toLowerCase().includes(filtraPorNome);
        }
        if (FiltraPorSaldo) {
          return conta.conta.saldo == FiltraPorSaldo;
        }
        if (FiltraPorTipoConta) {
          return conta.conta.tipo == FiltraPorTipoConta;
        }
        return conta
      })
    return res.status(200).json(filtroEscolhido);
};

const atualizaCliente = (req, res) => {
  const idCliente = req.params.idCliente;
  const { telefone, endereco:{cidade,CEP,estado} } = req.body;

  const clienteExiste = listaClientesBanco.find(
    (cliente) => cliente.id == idCliente
  );

  if(clienteExiste){
    const atualizarDados = {
      ...clienteExiste,
      telefone,
      endereco:{
        cidade,
        CEP,
        estado
      }   
    }
    listaClientesBanco.map((cliente,index)=>{
      if(cliente.id == idCliente){
        listaClientesBanco[index] = atualizarDados
      }
    });
    return res.status(200).json({
      message:`O cliente ${clienteExiste.nome_cliente} foi atualizado com sucesso`
    })    
  }
  return res.status(404).json({ messagem: 'O cliente não existe' });    
}

const deletaCliente = (req, res) => {
  const idCliente = req.params.id

  const clienteExiste = listaClientesBanco.find((cliente)=> cliente.id == idCliente)

  if(clienteExiste){
      listaClientesBanco.map((cliente,index)=>{
          if(cliente.id == idCliente){
              return listaClientesBanco.splice(index,1)
          }

      })
      return res.status(200).json({
         message:`O cliente ${clienteExiste.nome_cliente} foi deletado com sucesso`})
  }
  return res.status(404).json({
      message:"O cliente não foi encontrado"
  })
};

module.exports = {
    criaCliente,exibeCliente,atualizaCliente,deletaCliente
};
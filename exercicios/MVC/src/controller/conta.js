const listaClientesBanco = require('../model/contas-clientes.json')

const realizaDeposito = (req, res) => {
  const idCliente = req.params.id;
  const { deposito } = req.body;

  const clienteExiste = listaClientesBanco.find(
    (cliente) => cliente.id == idCliente
  );

  if (clienteExiste) {
    const transacaoDeposito = {
      ...clienteExiste.conta,
      saldo: clienteExiste.conta.saldo + deposito,
    };

    listaClientesBanco.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBanco[index].conta = transacaoDeposito;
      }
    });
    return res.status(200).json({
      message: `O depósito foi realizado com sucesso.Saldo R$ ${transacaoDeposito.saldo}`,
  })
}  
  return res.status(404).json({ messagem: 'Usuário não existe' });  
}

const realizaPagamento = (req, res) => {
  const idCliente = req.params.id;
  const { pagamento } = req.body;

  const clienteExiste = listaClientesBanco.find(
    (cliente) => cliente.id == idCliente
  );

  if (clienteExiste.conta.saldo >= pagamento) {
    const transacaoPagamento = {
      ...clienteExiste.conta,
      saldo: clienteExiste.conta.saldo - pagamento
    };

    listaClientesBanco.map((cliente, index) => {
      if (cliente.id == idCliente) {
        listaClientesBanco[index].conta =  transacaoPagamento
      }
    });
    return res.status(200).json({
      message: `O pagammento foi realizado com sucesso.Saldo R$ ${transacaoPagamento.saldo.toFixed(2)}`,
  })
  }
  return res.status(400).json({ messagem: 'Saldo insuficiente' });  
} 

module.exports = {realizaDeposito, realizaPagamento}
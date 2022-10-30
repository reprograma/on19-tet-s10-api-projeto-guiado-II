const express = require ('express');
const clienteController = require("./controller/cliente")
const contaController = require("./controller/conta")
const rotas  = express.Router();

rotas.post('/clientes/add',clienteController.criaCliente);
rotas.get('/clientes', clienteController.exibeCliente);
rotas.patch('/clientes/:idCliente/atualizar', clienteController.atualizaCliente);
rotas.delete('/clientes/:id', clienteController.deletaCliente);

rotas.patch('/clientes/:id/pagamento', contaController.realizaPagamento);
rotas.patch('/clientes/:id/deposito', contaController.realizaDeposito);

module.exports = rotas;
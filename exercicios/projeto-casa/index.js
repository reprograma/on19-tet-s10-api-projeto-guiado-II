const express = require('express');
const {v4: uuidv4} = require('uuid')
const moment = require('moment')
const app = express();
const port = 3000;
const listaClientes = require('./model/contas-clientes.json');

app.use(express.json());

app.post('/clientes/criar', (req, res) => {
    const { nome_cliente, cpf_cliente, data_nascimento, conta: {tipo} } = req.body;
    const criaID = uuidv4();

    const novoCliente = {
        id: criaID,
        nome_cliente: nome_cliente,
        cpf_cliente: cpf_cliente,
        data_nascimento: data_nascimento,
        conta: {
            numero: (Math.random() * 10000000).toFixed(0),
            tipo: tipo,
            saldo: 0,
            data_criacao: moment().format("YYYY-MM-DDTHH:mm:ss.SSS")+"Z" 
            //Usei anteriormente o modelo de "new Date" porém ele terminava de forma diferente ao da lista JSON então preferi estruturar todo o formato com Moment
        }
    }
    listaClientes.push(novoCliente);
    return res.status(201).json(novoCliente);
})

app.patch('/clientes/alterar/:id', (req, res) => {
    const clienteID = req.params.id;
    const { nome_cliente, conta: {tipo} } = req.body;

    const encontraCliente = listaClientes.find((cliente) => cliente.id == clienteID);

    if (encontraCliente) {
        const atualizaCadastro = {
            ...encontraCliente,
            nome_cliente: nome_cliente,
            conta: {
            ...encontraCliente.conta,
            tipo: tipo}
        };
        listaClientes.map((cliente, index) => {
            if (cliente.id == clienteID) {
                listaClientes[index] = atualizaCadastro
            }
        });
        return res.status(200).json({message: `Usuário ${encontraCliente.nome_cliente} foi atualizado com succeso.`});
    }
    return res.status(404).json({ messagem: 'Usuário não encontrado.' });
})

app.delete('/clientes/encerrar/:id', (req,res) => {
    const clienteID = req.params.id;

    const encontraCliente = listaClientes.find((cliente) => cliente.id == clienteID);

    if (encontraCliente) {
        listaClientes.map((cliente,index) => {
            if (cliente.id == clienteID) {
                return listaClientes.splice(index, 1)
            }
        })
        return res.status(200).json({message: 'Conta do cliente foi encerrada permanentemente.'})
    }
    return res.status(404).json({message: `Usuário não foi encontrado.`})
})

app.patch('/clientes/pagamento/:id', (req,res) => {
    const clienteID = req.params.id;
    const valorPagamento = Number(req.body);

    const encontraCliente = listaClientes.find((cliente) => cliente.id == clienteID);

    if (encontraCliente) {
        if (encontraCliente.conta.saldo > valorPagamento) {
        const fazPagamento = {
            ...encontraCliente,
            conta: {
                ...encontraCliente.conta,
                saldo: encontraCliente.conta.saldo - valorPagamento}
        }
        listaClientes.map((cliente, index) => {
            if (cliente.id == clienteID) {
                listaClientes[index] = fazPagamento
            }
        });
        return res.status(200).json({message: `Pagamento no valor de ${valorPagamento} foi realizado com succeso.`});
        }
        return res.status(400).json({message: 'Saldo em conta insuficiente para realizar pagamento.'});
    }
    return res.status(404).json({ messagem: 'Usuário não encontrado.' });
})

app.patch('/clientes/deposito/:id', (req, res) => {
    const clienteID = req.params.id;
    const valorDeposito = Number(req.body);

    const encontraCliente = listaClientes.find((cliente) => cliente.id == clienteID);

    if (encontraCliente) {
        const fazDeposito = {
            ...encontraCliente,
            conta: {
                ...encontraCliente.conta,
                saldo: encontraCliente.conta.saldo + valorDeposito}
        }
        listaClientes.map((cliente, index) => {
            if (cliente.id == clienteID) {
                listaClientes[index] = fazDeposito
            }
        });
        return res.status(200).json({message: `Depósito no valor de ${valorDeposito} foi realizado com succeso.`});
    }
    return res.status(404).json({ messagem: 'Usuário não encontrado.' });
})

app.get('/clientes', (req,res) => {
    const filtroNome = req.query.nome;
    const filtroCPF = req.query.cpf;

    const clienteFiltrado = listaClientes.filter((cliente) => {
        if (filtroNome) {
            return cliente.nome_cliente.includes(filtroNome)
        };
        if (filtroCPF) {
            return cliente.cpf_cliente == filtroCPF
        }
        return cliente
    })
    return res.json(clienteFiltrado)
})

app.listen(port, () => {
    console.log(`API está ouvindo a porta ${port}.`);
})
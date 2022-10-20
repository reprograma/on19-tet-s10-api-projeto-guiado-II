const express = require('express');
const app = express();
const port = 3435;
const listaClientes = require('./model/contas-clientes.json');
const { v4: uuidv4 } = require('uuid');
app.use(express.json());



app.use(express.json())
app.get(`/contas-clientes/:nome`, (req, res) => {
    const filtroNome = req.params.nome.toLowerCase()
    const filtroCPF = req.params.cpf

    const clienteFiltrado = listaClientes.filter((item) => {

        if (filtroNome) {
            return item.nome_cliente.toLowerCase() === filtroNome.toLowerCase()
        }
        if (filtroCPF) {
            return item.cpf_cliente === filtroCPF
        }
        return item
    })
    res.json(clienteFiltrado)
})


app.get("/contas-clientes/:id", (req, res) => {
    const id = req.params.id

    const clienteEscolhido = listaClientes.find((item, index) => cliente.id == id)
    if (clienteEscolhido) {
        return res.status(200).json(clienteEscolhido);
    }
    return res.status(404).json({ messagem: 'Cliente não existe' });
});



//- Atualizar informações desses clientes ( como endereço, telefone de contato...)
app.patch('/contas-clientes/:id', (req, res) => {
    const IDconta = req.params.id
    const novosCampos = req.body

    const contaExistente = listaClientes.find(conta => conta.id == IDconta)

    if (contaExistente) {
        const contaAtualizada = {
            ...contaExistente,
            ...novosCampos
        }

        return res.status(200).json(contaAtualizada)
    }
    return res.status(404).json({
        message: "Conta não encontrada"
    })
})
//- Fazer depósitos / pagamentos usando o saldo de sua conta

app.patch('/contas-clientes/:id/saque', (req, res) => {
    const IDconta = req.params.id
    const ValorDoSaque = req.body

    const contaExistente = listaClientes.find((cliente) => cliente.id == IDconta)
    const valor = ValorDoSaque
    const infoContas = contaExistente.conta
    if (contaExistente) {
        if (infoContas.saldo >= valor.saque) {
            infoContas.saldo = infoContas.saldo - valor.saque
            contaExistente.conta = infoContas
        } else {
            return res.status(404).json({
                message: "Conta não tem saldo suficiente"
            })
        }
        const contaAtualizada = {
            ...contaExistente,
            ...ValorDoSaque,
        }

        return res.status(200).json(contaAtualizada)
    }
    return res.status(404).json({
        message: "Conta não encontrada"
    })
})






//- Criar os clientes do banco


app.post('/contas-clientes', (req, res) => {
    const novoId = uuidv4();
    const infData = new Date();



    const {
        nome_cliente,
        cpf_cliente,
        data_nascimento,
        conta: {
            numero,
            tipo
        }

    } = req.body


    const novoClienteComID = {
        id: novoId,
        nome_cliente,
        cpf_cliente,
        data_nascimento,
        conta: {
            numero: numero,
            tipo: tipo,
            saldo: 0,
            data_criacao: infData
        }
    };

    listaClientes.push(novoClienteComID);
    return res.json(novoClienteComID);
})
//- Encerrar contas de clientes
app.delete("/contas-clientes/:id", (req, res) => {
    const IDconta = req.params.id

    const contaExistente = listaClientes.find((conta) => conta.id == IDconta)

    if (contaExistente) {

        listaClientes.map((conta, index) => {
            if (conta.id == IDconta) {
                return listaClientes.splice(index, 1)
            }

        })

        return res.status(200).json(listaClientes)
    }

    return res.status(404).json({
        message: "Conta não foi encontrada"
    })
})



//- Atualizar informações desses clientes ( como endereço, telefone de contato...) ok
//- Fazer depósitos / pagamentos usando o saldo de sua conta
//- Encerrar contas de clientes ok
//- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... ok


app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`);
});
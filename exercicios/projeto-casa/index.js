const express = require('express');
const app = express();
const port = 3333;
const clientAccountList = require('./model/contas-clientes.json')

app.use(express.json());

//DONE!- Criar os clientes do banco = POST 

const { uuid } = require('uuidv4');

app.post('/clients/add',(req,res)=>{
    const {nome_cliente, cpf_cliente, data_nascimento, pais, email, conta} = req.body;

    const newClient ={
        id: uuid(),
        nome_cliente: nome_cliente,
        cpf_cliente: cpf_cliente,
        data_nascimento: data_nascimento,
        pais: pais,
        email: email,
        conta: conta,
    };

    clientAccountList.push(newClient);
    return res.json(newClient);
   
})

//DONE!- Atualizar informações desses clientes ( como endereço, telefone de contato...) = PUT 
app.put('/clients/:id', (req,res)=>{
    const idClient = req.params.id
    const updatedBalance = req.body

    const thereIsTheClient = clientAccountList.find(client => client.id == idClient)

    if(thereIsTheClient){
        clientAccountList.map((client,index) =>{
            if(client.id == idClient){
                return clientAccountList[index] = updatedBalance
            }
        })
        return res.status(200).json({message:"Successfully updated client!", client: updatedBalance})// STATUS CODE 200 = OK
    }
    clientAccountList.push(updatedBalance)

    return res.status(201).json({message: "As it couldn't find the user, created a new one"}) // STATUS CODE 201 = CREATED
})

//- Fazer depósitos / pagamentos usando o saldo de sua conta
//PATCH -> alterando o valor (contas de + ou - e atualizar valor na conta principal)

//PROF SUZIK ME PERDOA, EU ENTENDI O RACIOCINIO, MAS NÃO SOUBE COMO COLOCAR ISSO NO CÓDIGO :(
app.patch('clients/balance', (req, res)=>{
    const idClient = req.params.id
    const newBalance = req.params.id
    const deposit = req.body
    const payment = req.body

    const thereIsTheClient = clientAccountList.find(client => client.id == idClient);

    if(thereIsTheClient){
        const updatedBalance ={
            ...clientAccountList.conta.saldo,
            newBalance,
        }

        //First rote - deposit
        clientAccountList.map((client,index) =>{
            if (deposit){
                const moreMoney ={
                    ...clientAccountList.conta,
                    balance: clientAccountList.conta.saldo + deposit == moreMoney
                }
                return updatedBalance
            }
            
            if(client.id == idClient){
                return clientAccountList[index] = updatedBalance
            }
        })
        return res.status(200).json({message: "Successfully updated balance!", balance: updatedBalance}) // STATUS CODE 200 = OK

        //Second rote: payment
        clientAccountList.map((client,index) =>{
            if (payment <= conta.saldo){
                const enoughMoney ={
                    ...clientAccountList.conta,
                    balance: clientAccountList.conta.saldo - payment == enoughMoney
                }
                return updatedBalance
            }
            return res.status(200).json({message: "Successfully updated balance!", balance: updatedBalance})
                
            if (payment > conta.saldo){ 
                const poor ={
                    ...clientAccountList.conta,
                    balance: clientAccountList.conta.saldo - payment == poor
                }
                return updatedBalance
            }
            if(client.id == idClient){
                return clientAccountList[index] = updatedBalance
            }
        })
        return res.status(403).json({message: "Unable to process payment: Low account balance", balance: updatedBalance}) //STATUS CODE 403 = Forbidden
    }
    return res.status(404).json({message: `Can't find the client ${idClient}`}) //STATUS CODE 404 = NOT FOUND
})

//DONE!- Encerrar contas de clientes = DELETE
app.delete('/clients/:id', (req, res)=>{
    const idClient = req.params.id

    const thereIsTheClient = clientAccountList.find((client) => client.id == idClient)

    if(thereIsTheClient){
        clientAccountList.map((client, index)=>{
            if(client.id == idClient){
                return clientAccountList.splice(index, 1)
            }
            })
            return res.status(200).json({ //STATUS CODE 200 = OK
                message:"Successfully deleted client!",
                client: thereIsTheClient
        })
    }
    return res.status(404).json({message: `Can't find the client ${idClient}`})//STATUS CODE 404 = NOT FOUND
})

//DONE!- Conseguir Filtrar os clientes do banco pelo seu nome,por saldo... = GET/FILTER/QUERY
app.get('/clients', (req,res) => {
    const filterName = req.query.nome_cliente
    const filterCpf = req.query.cpf_cliente
    const filterBankAccount = req.query.numero

    const choseFilter = clientAccountList.filter((item, index) =>{
        if(filterName){
            return item.nome_cliente.toLowerCase() == filterName.toLowerCase();
        }
        if(filterCpf){
            return item.cpf_cliente == filterCpf
        }
        if(filterBankAccount){
            return item.conta.numero == filterBankAccount
        } 
        return item
    })
    res.json(choseFilter);
});

app.listen(port,()=>{
    console.log(`API is working on the door ${port}`);
});
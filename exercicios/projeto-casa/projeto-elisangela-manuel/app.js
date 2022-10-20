const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid");
uuidv4();
const moment = require("moment")
const clientsBankAccount = require("./model/modified-structure-clients-bank-account.json");
const { request } = require("express");

app.use(express.json());

function ID() {
  return uuidv4();
}

function account() {
  const account = Math.random();
  function bankAccount() {
    const bankAccount = Math.round(account * 10 ** 7, -1);
    return bankAccount
  };
  return bankAccount();
};

app.get("/clients", (req, res) => {
  const filterName = req.query.name
  const filterType = req.query.type
  const filterCpf = req.query.cpf

  const findedClient = clientsBankAccount.filter((client) => {
    if (filterName) {
      return client.nome_cliente.toLowerCase() == filterName.toLowerCase()
    }

    if (filterType) {
      return client.conta.tipo.tipo_conta.toLowerCase() == filterType.toLowerCase()
    }
    if (filterCpf) {
      return client.cpf_cliente == filterCpf
    }
    return client
  });

  if (findedClient) {
    return res.status(200).json(findedClient);
  } else {
    return res.status(404).json({ message: "Data not found" });
  }

})

app.post("/clients/addBankAccount", (req, res) => {

  const {
    nome_cliente,
    cpf_cliente,
    data_nascimento,
    conta: {
      numero,
      tipo: {
        tipo_conta,
        transacao_entrada,
        transacao_saida,
      },
      saldo,
      data_criacao,
    },
  } = req.body;

  const newClientId = {
    id: ID(),
    nome_cliente: nome_cliente,
    cpf_cliente: cpf_cliente,
    data_nascimento: data_nascimento,
    conta: {
      numero: numero,
      tipo: {
        tipo_conta: tipo_conta,
        transacao_entrada: transacao_entrada,
        transacao_saida: transacao_saida,
      },
      saldo: saldo,
      data_criacao: data_criacao,
    },
  };

  clientsBankAccount.push(newClientId);

  const formatDate = moment(newClientId.conta[data_criacao]).format();

  newClientId.conta.data_criacao = formatDate;
  newClientId.conta.numero = account();

  return res.status(200).json({ ...newClientId });
});


app.patch("/clients/updatedata/:id", (req, res) => {
  const clientID = req.params.id
  let { data_nascimento } = req.body;
  data_nascimento = req.body
  let newAccount = req.body

  let findedID = clientsBankAccount.find((ID) => ID.id == clientID);
  const userIndex = clientsBankAccount.findIndex(user => user.id === clientID)

  if (userIndex) {
    const clientFinded = clientsBankAccount[userIndex]

    const typeUpdate = {
      ...clientFinded,
      ...newAccount
    }

    clientsBankAccount.splice(userIndex, 1, typeUpdate)

    return res.status(200).json({
      message: `Data has been updated`,
    });
  }

  if (findedID) {

    const updatedBirthday = {
      ...findedID,
      data_nascimento: data_nascimento,
    };

    clientsBankAccount.map((client, index) => {
      if (client.id == clientID) {
        clientsBankAccount[index] = updatedBirthday;
      }
    });

    return res.status(200).json({
      message: `Data has been updated`,
    });
  }

  return res.status(404).json({ messagem: 'Date not found' });
})

app.patch("/clients/incomingbanktransaction/:cpf", (req, res) => {
  const clientCpf = req.params.cpf
  const incoming = req.body

  const checkClient = clientsBankAccount.find(
    client => client.cpf_cliente == clientCpf
  )

  if (checkClient) {
    const updatedBankBalance = {
      ...checkClient.conta,
      saldo: clientsBankAccount.conta.saldo + incoming
    }
    clientsBankAccount.map((client, index) => {
      if (client.cpf_cliente == clientCpf) {
        clientsBankAccount[index] = updatedBankBalance
      }
    })
    return res.status(201).json(clientsBankAccount[clientCpf])
  }
  return res.status(404).json({ message: 'Account not exist' })
})


app.patch("/clients/outgoingbanktransaction/:cpf", (req, res) => {
  const clientCpf = req.params.cpf
  const outgoing = req.body

  const checkClient = clientsBankAccount.find(
    client => client.cpf_cliente == clientCpf
  )

  if (checkClient) {
    const updatedBankBalance = {
      ...checkClient.conta,
      saldo: clientsBankAccount.conta.saldo - outgoing
    }
    clientsBankAccount.map((client, index) => {
      if (client.cpf_cliente == clientCpf) {
        clientsBankAccount[index] = updatedBankBalance
      }
    })
    return res.status(201).json(clientsBankAccount[clientCpf])
  }
  if (existeCliente.conta.saldo < pagamento) {
    return res.status(404).json({ message: 'Saldo insuficiente' })
  }
  return res.status(404).json({ message: 'Account not exist' })
})


app.delete("/clients/addBankAccount/:id", (req, res) => {
  const idForDelete = req.params.id
  const findUser = clientsBankAccount.find((user) => user.id === idForDelete)

  if (findUser) {
    clientsBankAccount.map((user, index) => {
      if (user.id === idForDelete) {
        return clientsBankAccount.splice(index, 1)
      }
    })

    return res.status(200).json({ message: "That account has been deleted from the server" })
  }

  return res.status(404).json({
    message: "ID not Found"
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

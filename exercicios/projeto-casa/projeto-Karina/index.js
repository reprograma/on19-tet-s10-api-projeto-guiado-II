const express = require('express');
const app = express();
const port = 3000;
const listaClientes = require('./model/consultas-clientes.json');

app.use(express.json());
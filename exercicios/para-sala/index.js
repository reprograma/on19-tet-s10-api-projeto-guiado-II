/*
//- Os usuários conseguiram marcar uma consulta

- Poderei cancelar uma consulta na lista de consultas
- Posso alterar informações do usuário
- Posso pegar as consultas marcadas desse cliente
*/

const express = require('express')
const app = express()
const port = 3333
const listaClientes = require ('./model/consultas-clientes.json')

app.use(express.json())
//Função ID Procedimentos

const recebeUltimoIDConsulta = (cliente) => {
    const arrayDeConsultasOrdenado = cliente.procedimentos.sort(
        (consultaA,consultaB) => {
        if(consultaA.id < consultaB.id) {
            return -1   //inverte a ordem, vai para o final da lista > ordem crescente
        } 
        if(consultaA.id > consultaB.id) {
            return 1 
        }
        return 0
    })
    const consultaMaiorID = arrayDeConsultasOrdenado[arrayDeConsultasOrdenado.length -1]

    return consultaMaiorID?.id +1 || 0 // "Valor Default" || OU retorne um zero
    // Se array vazio, volta como Undefined, se não existir trate como zero
    // ? > Verificar se variavel existe 

}


//- Poderei adicionar novos usuários ao sistema do consultório:
//Cria função auxiliar
const recebeUltimoID = () => {
   const novoArrayOrdenado = listaClientes.sort((clienteA, clienteB)=>{ //ordenar lista
        if(clienteA.id < clienteB.id) {
            return -1   //inverte a ordem, vai para o final da lista > ordem crescente
        } 
        if(clienteA.id > clienteB.id) {
            return 1 
        }
        return 0
    })
    const valorUltimoID = novoArrayOrdenado[novoArrayOrdenado.length -1] //pegar último item no array > [valor do índice]
    return valorUltimoID.id + 1 //add no id +1 para não repetir
}

app.post("/clientes/add", (req,res)=> {
    const {nome_cliente, pet} = req.body    // receber formulário 
    
    const IDnovo = recebeUltimoID()

    const novoClienteComID = { //Cria função auxiliar >  Id IncrementalAdd > um identificar único, último + 1
        id: IDnovo,
        nome_cliente,
        pet,
        procedimentos: [], //atualizar depois, colocar vazio
    }    
    listaClientes.push(novoClienteComID)  // Incluir cliente no "BD"
    return res.status(201).json(novoClienteComID) // 201 = cód criado

})

//- Os usuários conseguiram marcar uma consulta - 1 usuário faz várias consultas
// Problema: e se tiver mais de uma consulta
// Solução: criar array de objetos (procedimento 1 para N)
// Problema 2: Alterar a data da consulta
app.patch("/clientes/:id/consulta", (req, res) => {  //usuario/1/consulta
    const {nome, data} = req.body
    const IDCliente = req.params.id //pegar id usuario p encontrar na lista

    const existeCliente = listaClientes.find(
        (cliente) => cliente.id == IDCliente
    )
        if (existeCliente){
            const ultimoIDConsultas = recebeUltimoIDConsulta(existeCliente)
            const novaConsulta = {
                id: ultimoIDConsultas,
                nome: nome,
                data: data,
              }
        listaClientes.map((cliente, index) => {
            if (cliente.id == IDCliente) {
                listaClientes[index].procedimentos.push({  //atualiza lista principal
                    ...novaConsulta,
                })
            }
        })
        return res.status(200).json(listaClientes)
        }
        return res.status(404).json({message: `Cliente com ID: ${IDCliente} não existe`})

})

//- Os usuários poderão atualizar o dia de sua consulta > Encontrar o cliente e consulta
app.patch("/clientes/:idCliente/consulta/:idConsulta", (req, res)=>{
    const idCliente = req.params.idCliente
    const idConsulta = req.params.idConsulta
    const {data} = req.body

    const clienteExiste = listaClientes.find(
        (cliente) => cliente.id == idCliente
    )
        if(clienteExiste) {
const novasConsultas = clienteExiste.procedimentos.map( // Encontrar consulta + Atualizar com nova data
            (procedimento, index) => {       // map retorna array novo
                if (procedimento.id == idConsulta){
                    procedimento.data = data
                }
            }
            ) 
            listaClientes.map((cliente,index) => {
                if (cliente.id == idCliente) {
                listaClientes[index].procedimentos = novasConsultas
                }
            })
            return res.status(200).json()
        }
    
        return res.status(404).json({message: 'Cliente não encontrado'})

})


app.listen(port, () => {
    console.log(`API está rodando na porta ${port}`)
})
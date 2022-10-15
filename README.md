<h1 align="center">
  <img src="assets/reprograma-fundos-claros.png" alt="logo reprograma" width="500">
</h1>

# Tema da Aula

Turma Online 19 - Todas em Tech  | Back-end | Semana 10 | 2022 | Professora Manuelly Suzik

### Instruções

Antes de começar, vamos organizar nosso setup.

* Fork esse repositório
* Clone o fork na sua máquina (Para isso basta abrir o seu terminal e digitar `git clone url-do-seu-repositorio-forkado`)
* Entre na pasta do seu repositório (Para isso basta abrir o seu terminal e digitar `cd nome-do-seu-repositorio-forkado`)
* [Add outras intrucoes caso necessario]

### Resumo

O que veremos na aula de hoje?

* [Algoritmo](#algoritmo)
* [Pseudo código](#pseudo)
* [Observações](#observacoes)

## Conteúdo

### Algoritmo

1. [Pensar como uma máquina](#pensar-como-uma-máquina)
2. [Entender o que a máquina diz](#entender-o-que-a-máquina-diz)

### Pseudo Código

1. [Como escrever](#topico3)
2. [O que não é pseudo código](#topico3)

### Observações

1. [Não conte com bananas conte com frutas](#topico4)
2. [Quando devo parar?](#observações)

### Algoritmo

#### Pensar como uma máquina

As máquinas foram desenvolvidas para suprir nossas necessidades, automatizar processos repetitivos e para facilitar nossa vida. Mas desenvolvemos máquinas que dependem completamente de como entregamos as instruções para elas. Sendo assim, quando estiver desenvolvendo para uma máquina é importante entender o que ela pode ou não compreender.

#### Entender o que a máquina diz

Sabemos que a máquina pode se comportar de formas complicadas às vezes mas TUDO tem uma razão. Por isso, a linguagem e compiladores entendendo nossas limitações como seres humanos e também para facilitar a forma como nos comunicarmos com a máquina foram criados mecanismos para nos informar o que deu errado e como corrigir.

* **Console** : Funciona como output para exibir alguma operação não permitida, stack trace ou o que a máquina não conseguiu compreender corretamente dentro de seu algoritmo. Algumas vezes funciona como debugger se você adicionar logs de informação para termos uma visibilidade do que está acontecendo no fluxo do uso de nossa aplicação. Sempre leia o console com ATENÇÃO pois ele pode te dizer exatamente onde você errou.
* **Stack Trace**: Nos informa exatamente de onde o erro surgiu e como ele afetou o restante do código:
  * Exemplo: Se eu tentar subir uma API no mesmo endereço de uma API que já está em uso aparecerá uma mensagem como essa no seu console:

  ```javascript
      node:events:491
        throw er; // Unhandled 'error' event
        ^

        Error: listen EADDRINUSE: address already in use :::3000 // <- Aqui literalmente ele diz que o endereço :3000 já está em uso
            at Server.setupListenHandle [as _listen2] (node:net:1432:16)
            at listenInCluster (node:net:1480:12)
            at Server.listen (node:net:1568:7)
            at Function.listen (/home/hyewonx/Projetos/reprograma/on19-tet-s10-api-projeto-guiado-II/exercicios/para-sala/node_modules/express/lib/application.js:635:24)
            at Object.<anonymous> (/home/hyewonx/Projetos/reprograma/on19-tet-s10-api-projeto-guiado-II/exercicios/para-sala/index.js:5:5)
            at Module._compile (node:internal/modules/cjs/loader:1126:14)
            at Object.Module._extensions..js (node:internal/modules/cjs/loader:1180:10)
            at Module.load (node:internal/modules/cjs/loader:1004:32)
            at Function.Module._load (node:internal/modules/cjs/loader:839:12)
            at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
        Emitted 'error' event on Server instance at:
            at emitErrorNT (node:net:1459:8)
            at processTicksAndRejections (node:internal/process/task_queues:83:21) {
          code: 'EADDRINUSE',
          errno: -98,
          syscall: 'listen', // <- aqui ainda é dada mais informações sobre o evento que o sistema chamou e que está consumindo, que é o evento .listen()
          address: '::',
          port: 3000
        }
  ```

  O que isso nos diz é tudo que precisamos saber para finalizar o processo que está correndo OU pedir outra porta de serviço para subir nossa aplicação. O que precisamos fazer é ouvir , compreender e agir para corrigir o problema.

### Pseudo Código

#### Como escrever

Vamos fingir que foi pedido por um cliente para criar uma API conectada com um banco de dados, rotas que listam usuários, deletam e também atualizam usuários, cadastros e etc...
Isso pode ser muito complicado de criar de uma vez , tendo em vista que não sabemos ainda como integrar com um banco de dados. O que podemos fazer?

* Primeiro: não entre em pânico.
* Segundo: Escreva em português os passos para se criar essa API.
* Aqui vai um exemplo que eu seguiria:
  * Para a API: Preciso de rotas para manipular os dados ( listar, filtrar , criar , atualizar e deletar )
  * Para o banco de dados: escolher um banco e entender como ele funciona...
  * Testar o funcionamento das minhas rotas sem integrar com o banco
  * Pouco a pouco integrar com o banco de dados e testar as rotas novamente integradas com um banco de dados...

  Esse processo pode ser resolvido de uma vez ou talvez você precise voltar e colocar mais informações a medida que os desafios forem aparecendo. Isso não importa, desde que você tenha um plano.
  
  Algumas vezes você vai precisar voltar uns passos e colocar informações mais detalhadas nos itens mais generalistas:
  * Criar a rota de atualizar usuário:
    * Pergunta: Como encontrar o usuário que eu quero atualizar para não atualizar o usuário errado?
    * Resposta: Usando um indentificador único para cada usuário, posso pegar essa informação pelo `req.params.id`.
  
  E assim por diante...

#### O que não é pseudo código

Pseudo código não é você abrir o VSCODE e escrever uma linguagem de programação. Existe o processo de entender o que precisa ser feito e ter uma ideia de por onde começar. É pra isso que serve o pseudo código

### Observações

#### Não conte com bananas conte com frutas

Você já deve ter se encontrado nessa situação: Durante a aula , com a professora explicando, tudo faz sentido e parece bem fácil. Mas quando eu começo a criar ou se tento fazer alguma coisa fora do escopo nunca da certo e eu me perco, é como se eu não soubesse de nada.

Isso acontece normalmente quando você está apenas replicando algo que foi te ensinado e não pensou além do que aquelas linhas de códigos significam. Cada linha de código tem um efeito em sua aplicação. Elas não são colocadas por acaso, por isso é muito importante ter o discernimento de entender quando podemos adicionar ou substituir algo por uma modificação que queremos. Não aprenda a fazer só com bananas, olhe para as frutas!

#### A formula do sucesso

 Nosso cérebro é um musculo. É normal que ele sinta fadiga ou que ele precise de estímulo para crescer e desenvolver. A prática é a melhor forma de seu cérebro conseguir fazer conexões e entender como as coisas funcionam.

 Algumas vezes também é necessário entender que a resposta que está na sua frente não vai ser encontrada virando noites de sono acordada, mas tirando uma pausa, deixando seu cérebro funcionar em background para enfim você retornar e assimilar melhor o problema.
***

### Exercícios

* [Exercicio para sala](/exercicios/para-sala/)
* [Exercicio para casa](/exercicios/para-casa/)

### Material da aula

### Links Úteis

* [Pseudo Codigo](https://blog.betrybe.com/tecnologia/pseudocodigo/)

* [O que é algoritmo](https://dicasdeprogramacao.com.br/o-que-e-algoritmo/)
* [Pseudo Cõdigo para algoritmos](https://embarcados.com.br/pseudocodigo/)

<p align="center">
Desenvolvido com :purple_heart:  
</p>

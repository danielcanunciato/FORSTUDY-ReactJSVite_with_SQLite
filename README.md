## PROJETO CRIADO PARA FINS DE ESTUDO
Olá!, sou Daniel Anunciato, conhecido na internet como ClooverDev, sou programador intermediário e desenvolvedor de jogos.
Eu estou estudando várias partes da lógica de programação para fins de aprimorar minhas habilidades e montar uma carreira profissional melhor, e também, usar esses conhecimentos nos meus jogos.

Aqui neste projeto estou usando para praticar comandos em SQL, APIs em ExpressJS e relacionamento da API e Banco de Dados com o frontend feito em ReactJS + Vite.

Como teste criei uma API que cria tabelas de usuários e produtos imaginários, e mostrando no Frontend os produtos existentes e de que usuários são esses produtos, também demonstro quais produtos estão atrelados a clientes específicos,
que procura na tabela de usuários o ID do cliente para encontrar seu nome, e também retornar nome do cliente ativo por ID juntamente com os produtos atrelados ao seu id.

Na tabela de usuários há apenas seu ID (sua PK) que se autoincrementa e seu nome, na tabela de produtos contém seu id (sua PK), nome, preço e uma chave estrangeira que é o id do cliente que realizou o cadastramento do produto.

## INSTRUÇÕES DE COMO EXECUTAR O PROJETO
Para executar o frontend:
 - *cd ./frontend*
 - se o caminho mostrar a pasta mais "/frontend", execute: *npm run dev*

Para executar o backend:
  - *cd ./backend*
  - se o caminho mostrar a pasta mais "/backend", execute: *node server.js*

Para executar os testes da API no Postman

### MÉTODOS GET
 GET para ver todos os usuarios ativos no banco
 > localhost:4400/users

 GET para achar um usuario ativo especifico por id
 > localhost:4400/users/1
    (o numero pode ser qualquer ID, contanto que o usuario exista)

 GET para achar todos os produtos
 > localhost:4400/products

 GET para achar todos os produtos de um usuario especifico
 > localhost:4400/products/1
    (o numero apos 'products' é o ID do cliente ativo no banco que esteja atrelado aos produtos)

### MÉTODOS POST
 POST para criar um cliente novo (em forma de query)
 > localhost:4400/users?clientName=NomeDoCliente

 Ele irá retornar um erro se:
  1. A query não tiver o parâmetro 'clientName'
  2. Se o cliente colocado no parâmetro já existir
  3. A query tiver seu parâmetro vazio

<==============================================================>

 POST para criar produto novo (em forma de body) :: Aqui no caso ele utiliza a forma em body, que é um corpo de JSON que envia a API como resposta, para criar um body precisa criar um JSON em *Body -> raw* e seguir o exemplo abaixo

 EXEMPLO DE RESPOSTA PRO BODY
 {
   "name" : "Nome do Produto",
   "price" : 000.00,
   "clientName" : "Nome do Cliente"
 }

 Ele irá retornar um erro se:
  1. O cliente não existir
  2. Um produto com o mesmo nome já existir
  3. Se tiver informação faltando, a resposta no body tem que conter um JSON com as chaves 'name', 'price' e 'clientName'

 > localhost:4400/products
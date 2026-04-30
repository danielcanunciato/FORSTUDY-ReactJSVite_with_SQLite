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

### MÉTODOS

======== LOGIN ========
Essa parte é essencial para esses testes porque também foi feito testes com criptografia e token de autorização, aqui
utiliza JWT ou Json Web Token para criptografia, então existe uma chamada de método POST para login e criação
de token JWT.
Apenas faça uma chamada em POST e coloque a url a seguir:
> localhost:4400/login

Abra o método no postman como requisição Body e coloque os dados a seguir
{
  "username" : "DEVTEST",
  "password" : "DEVTEST123"
}

Este usuário é criado automaticamente e foi programado para ele não poder ser deletado por nenhum outro usuário,
pode se dizer que é um usuário Sistema, você pode manipular a vontade, ele foi criado mais para ter um usuário fixo
para testes, ainda mais que todos os métodos tirando o GET utilizam usuários que tenham uma "role" como "mst" ou "adm".
Ele é criado automaticamente pelo home da API (no caso o http://localhost:4400/), se quiser criá-lo apenas execute o
backend e abra o link da API, ou faça uma chamada GET com a url acima.

O token gerado pelo login você pode colocar em Authorization e trocar o Auth Type para "Bearer Token" e colocar o token
como value.

Métodos GETs são liberados para qualquer usuário.
Métodos POSTs são liberados para usuários com cargos "adm" ou "mst".
Quaisquer outros métodos são liberadods apenas para usuários com cargos "mst".

Se tentar executar métodos POST ou qualquer outro método sem token de um usuário com permissão, irá retornar um erro dizendo
que tem um token faltando, ou se caso o token tiver expirado (ele expira depois de 1-2h, você pode aumentar na API),
vai precisar relogar e gerar um token novo.

Qualquer outro erro que acontecer dentro do backend por algum motivo, vai retornar um erro de código 500, que é um erro
geral para Backend (ou Server Error)

======== USUÁRIOS ========
 GET para ver todos os usuarios ativos no banco
 > localhost:4400/users
 
 GET para ver todos os usuários de um cargo específico (usr,adm,mst)
 > localhost:4400/users?role=cargo
  >> EX: /users?role=usr

 GET para achar um usuário por id
 > localhost:4400/users/:id
  >> EX: /users/1

 POST para criar um novo usuário
 > localhost:4400/users

 É uma requisição em Body, então precisa abrir o Body como raw JSON e colocar da seguinte estrutura
 {
  "userName" : "Nome do Usuário",
  "userPass" : "Senha do Usuário",
  "userRole" : "Cargo do Usuário"
 }

 O cargo do usuário não pode ser um imaginário a não ser que você crie, ele é especificado no começo da API como constante.
 Os cargos existentes são esses: "usr", "adm", "mst".

 * Erros que podem acontecer:
  Err 409 Conflict: Um usuário do mesmo nome já existe.
  Err 422 Unprocessable Entity: Falta de informações necessárias

======== CLIENTES ========
 GET para ver todos os clientes
 > localhost:4400/clients

 GET para achar um cliente por id
 > localhost:4400/clients/:id

 POST para criar um novo cliente
 > localhost:4400/clients

 É uma requisição em query parameter, então vá para Params e crie uma nova Key-Value ou coloque no link.
 A Key da query precisa ser "clientName" e a Value o nome do cliente.

 Ex 1:
  > http://localhost:4400/clients?clientName=Nome do Cliente

 Ex 2:
  Pode trocar Key por "clientName" e Value pelo nome do cliente.

 * Erros que podem ocorrer:
  Err 409 Conflict: Um cliente pelo mesmo nome já existe

 DELETE para apagar um usuário existente por id
 > localhost:4400/users/:userID


======== PRODUTOS ========
 GET para ver todos os produtos
 > localhost:4400/products

 GET para ver todos os produtos por id de cliente
 > localhost:4400/products/:clientID
  >> EX: /products/1

 GET para achar um produto por id específico
 > localhost:4400/prod/:prodID
  >> EX: /products/prod/1

 POST para criar um novo produto
 > localhost:4400/products

 É uma requisição em Body, então precisa ser uma request em raw JSON, seguindo exatamente a estrutura abaixo
 {
  "name" : "Nome do Produto",
  "price" : 00.00,
  "quantity" : 1,
  "status" : "Shipping",
  "clientName" : "Nome do Cliente"
 }

 "price" tem que ser um número, pode ser decimal, ele é automaticamente transformado em preço em R$ no frontend.
 "quantity" é quanto desse item foi solicitado
 "status" pode ser um próprio seu, mas eu defini SHIPPING, RECEIVED e CANCELED.
 "clientName" **PRECISA** ser um cliente que exista na tabela de clientes, se não vai dar erro

 * Erros que podem ocorrer:
  Err 400 Bad Request: Informações necessárias estão faltando
  Err 404 Not Found:   O ID do cliente que foi mencionado pelo clientName não existe.
  Err 409 Conflict:    O nome do produto já existe na lista de produtos atrelados ao cliente (pode ter um produto com o mesmo nome caso seja outro cliente)


===== INFORMAÇÕES EXTRAS =====
 NOTA: Teve dois GETs para os produtos, um para produto e outro para cliente por conta da maneira por conta que eu precisava
 de um GET para encontrar um produto específico pelo seu ID e um GET para buscar todos os produtos de um id de cliente
 específico.
**MeetApp - GoStack5 Rocketseat**

**Sobre o repositório**
Este repositório se refere ao código do backend da aplicação, feita em REST API, ela fica responsável por todas as requisições e operações feita no banco de dados.

**Tecnologias utilizadas**

- Adonis JS
- MySQL
- Redis
- Mailtrap para envio de e-mails no ambiente de dev

**Ambientação**
Caso não possua o Adonis instalado em sua máquina, utilize:

    npm i -g @adonisjs/cli

Em seguida, clone o projeto

    git clone git@github.com:rodolfo-rosa-silva/meetapp-backend.git

Dentro da pasta do projeto, instale as dependências

    cd meetapp-backend
    yarn

Crie um arquivo na raíz do projeto, com o nome `.env` utilizando as informações do `.env.example` como base.

Agora é preciso rodar as migrations para criar as tabelas no banco de dados. Certifique-se que o seu MySQL está rodando e possua um banco criado com o nome `meetapp`

    adonis migration:run

Com o MySQL e o Redis rodando em sua máquina, será preciso ter dois terminais rodando simultaneamente, com os seguintes comandos:

Terminal 1 (sobe o servidor do Adonis)

    adonis serve --dev

Terminal 2 (coloca o kue para escutar as tarefas e processar no Redis)

    adonis kue:listen

Pronto! Agora você já pode acessar as endpoints da API através do seu http://localhost:3333

## **Endpoints**

Exceto as rotas `/signup` e `/signin` não precisam de autenticação, todas as outras necessitam de um `Bearer Token` na requisição.

**Usuário**

**Cadastro**

**Rota:** - `/signup`

**Método:** - POST

**Formato:** - JSON

**Dados:**

username: `string`

email: `string`

password: `string`

---

**Login**

**Rota:** - `/signin`

**Método:** - POST

**Formato:** - JSON

**Dados:**

email: `string`

password: `string`

---

**Edição do usuário (listagem dos dados)**

**Rota:** - `/profile`

**Método:** - GET

**Formato:** - JSON

**Dados:** - No Body

---

**Edição do usuário (salvar os dados)**

**Rota:** - `/profile`

**Método:** - PUT

**Formato:** - JSON

**Dados:**

username: `string`

password: `string`

password_confirmation: `string`

preferences: `array`

---

**Preferências (listagem)**

**Rota:** - `/preferences`

**Método:** - GET

**Formato:** - JSON

**Dados:** - No Body

---

**Preferências (cadastro)**

**Rota:** - `/preferences/save`

**Método:** - POST

**Formato:** - JSON

**Dados:**

preferences: `array`

---

**File (cadastro)**

**Rota:** - `/files`

**Método:** - POST

**Formato:** - Multipart

**Campo** - `file`

**Header** - `Content-Type` `multipart/form-data`

**Dados:**

preferences: `array`

---

**File (listagem)**

**Rota:** - `/files/:file`(este parâmetro `file` é o valor do campo `file` da tabela)

**Método:** - GET

**Dados:** - No Body

---

**File (deleção)**

**Rota:** - `/files/:id`

**Método:** - DELETE

**Dados:** - No Body

---

**Meetups (listagem)**

**Rota:** - `/dashboard`

**Método:** - GET

**Dados:** - No Body

---

**Meetups (listagem individual)**

**Rota:** - `/meetup/:id`

**Método:** - GET

**Dados:** - No Body

---

**Meetups (cadastro)**

**Rota:** - `/meetup`

**Método:** - POST

**Formato:** - JSON

**Dados:**

title: `string`

description: `string`

location: `string`

datetime: `string` (YYYY-MM-DD H:I:S)

file_id: `number`

preferences: `array`

---

**Meetups (inscrição)**

**Rota:** - `/meetup/subscription`

**Método:** - POST

**Formato:** - JSON

**Dados:**

meetup_id: `number`

redirect_url: `string`

---

**Meetups (confirmar inscrição)**

**Rota:** - `/meetup/confirmation`

**Método:** - POST

**Formato:** - JSON

**Dados:**

meetup_id: `number`

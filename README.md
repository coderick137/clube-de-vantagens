# API de Clube de beneficios

Esta é uma API REST desenvolvida em NestJS para gerenciar um clube de beneficios. A API utiliza Postgre como banco de dados, Docker para containerização. Além disso, a documentação da API é gerada automaticamente com Swagger e a autenticação é realizada via JWT com AuthGuard.

## Sumário

- Tecnologias Utilizadas
- Instalação e Execução
- Decisões Técnicas
- Endpoints da API
- Exemplos de Requisições e Respostas
- Contribuição
- Licença

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **NestJS**: Framework para construção de APIs escaláveis e eficientes.
- **TypeORM**: ORM para acesso ao banco de dados.
- **Postgre**: Banco de dados relacional.
- **Docker**: Para containerização da aplicação e banco de dados.
- **Swagger**: Para documentação da API.
- **JWT (JSON Web Token)**: Para autenticação de usuários.
- **AuthGuard**: Middleware de autenticação do NestJS.

## Instalação e Execução

### Pré-requisitos

- Docker e Docker Compose instalados.
- Node.js (versão 18 ou superior).

### Passos para Execução

1. Clone o repositório:

   ```bash
   git clone git@github.com:coderick137/clube-de-vantagens.git

   cd clube-de-vantagens
   ```

2. Inicie o banco de dados:

   ```bash
   docker-compose up -d
   ```

   Ou rode o porojeto:

   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev

   # production mode
   $ npm run start:prod

   ```

3. Acesse a API em:

   - Swagger UI: <http://localhost:3000/api>

4. Para parar os contêineres, execute:

   ```bash
   docker-compose down
   ```

## Decisões Técnicas

### 1. TypeORM com Postgre SQL

TypeORM foi utilizado por sua integração nativa com NestJS e suporte a múltiplos bancos de dados.

### 3. Containerização com Docker

O uso de Docker facilita a configuração do ambiente de desenvolvimento e garante que a aplicação funcione de forma consistente em diferentes sistemas.

### 4. Autenticação com JWT e AuthGuard

A API utiliza JWT para autenticação e protege as rotas utilizando AuthGuard. Isso garante segurança na manipulação dos produtos e exige um token válido para acessar os endpoints protegidos.

### 5. Swagger para Documentação

Swagger foi utilizado para gerar documentação automática da API, permitindo que os desenvolvedores testem e entendam os endpoints de forma interativa.

## Endpoints da API

## Sumário

- [Autenticação](#autenticacao)
  - [Login](#login)
- [Clientes](#clientes)
  - [Criar um novo cliente](#criar-um-novo-cliente)
  - [Obter todos os clientes](#obter-todos-os-clientes)
- [Produtos](#produtos)
  - [Criar um novo produto](#criar-um-novo-produto)
  - [Listar todos os produtos](#listar-todos-os-produtos)
  - [Obter um produto por ID](#obter-um-produto-por-id)
- [Compras](#compras)
  - [Criar uma compra](#criar-uma-compra)
  - [Listar todas as compras do cliente autenticado](#listar-todas-as-compras-do-cliente-autenticado)
- [Pagamentos](#pagamentos)
  - [Realizar pagamento de uma compra](#realizar-pagamento-de-uma-compra)
- [Relatórios](#relatorios)
  - [Gerar relatório de vendas](#gerar-relatorio-de-vendas)

---

---

## Autenticação

### Login

**POST /auth/login**

### Autentica um usuário.

A rota de autenticação é pública e não requer um token JWT para ser acessada. Ela permite que os usuários façam login e obtenham um token de acesso para autenticação nas demais rotas protegidas.

**Corpo da requisição:**

```json
{
  "email": "teste.exemplo@email.com",
  "senha": "senhadoclienteteste1"
}
```

**Respostas:**

- `200`: Login realizado com sucesso.
- `400`: Dados inválidos.

### **⚠️ Importante:** Todas as rotas abaixo precisam de autenticação. Certifique-se de incluir o token JWT no cabeçalho das requisições protegidas.

## Clientes

### Criar um novo cliente

**POST /clientes**

### Cria um novo cliente.

**Corpo da requisição:**

```json
{
  "nome": "José da Silva",
  "email": "exemplo@email.com",
  "senha": "senhadocliente1",
  "tipo": "cliente"
}
```

**Respostas:**

- `201`: Cliente criado com sucesso.
- `400`: Dados inválidos.

### Obter todos os clientes

**⚠️ Importante:** Esta rota é restrita a usuários com perfil de administrador ('admin'). Certifique-se de que o token JWT utilizado na requisição pertence a um usuário com as permissões adequadas.

**GET /clientes**

### Retorna uma lista de todos os clientes.

**Respostas:**

- `200`: Lista de clientes.

```json
[
  {
    "nome": "José da Silva",
    "email": "exemplo@email.com",
    "senha": "senhadocliente1",
    "tipo": "cliente"
  }
]
```

- `401`: Não autorizado.
- `403`: Acesso negado.

---

## Produtos

### Criar um novo produto

**POST /produtos**

Cria um novo produto.

**Corpo da requisição:**

```json
{
  "nome": "Produto 1",
  "descricao": "Descrição detalhada do produto 1",
  "categoria": "Eletrônicos",
  "preco": 100
}
```

**Respostas:**

- `201`: Produto criado com sucesso.
- `400`: Dados inválidos.
- `401`: Token inválido ou não autorizado.

### Listar todos os produtos

**GET /produtos**

Retorna uma lista de produtos com paginação e filtros.

**Parâmetros:**

- `page`: Número da página (padrão: 1).
- `limit`: Número de itens por página (padrão: 10).

**Respostas:**

- `200`: Lista de produtos retornada com sucesso.
- `401`: Token inválido ou não autorizado.

### Obter um produto por ID

**GET /produtos/{id}**

Retorna um produto pelo seu ID.

**Parâmetros:**

- `id`: ID do produto.

**Respostas:**

- `200`: Produto retornado com sucesso.
- `401`: Token inválido ou não autorizado.
- `404`: Produto não encontrado.

---

## Compras

### Criar uma compra

**POST /compras**

Cria uma nova compra.

**Corpo da requisição:**

```json
{
  "produtos": [
    {
      "produtoId": 1,
      "quantidade": 3
    }
  ],
  "status": "Pendente"
}
```

**Respostas:**

- `201`: Compra criada com sucesso.
- `400`: Dados inválidos.

### Listar todas as compras do cliente autenticado

**GET /compras**

Retorna a lista de todas as compras do cliente autenticado.

**Respostas:**

- `200`: Lista de compras retornada.
- `401`: Não autorizado.

---

## Pagamentos

### Realizar pagamento de uma compra

**POST /pagamentos/{compraId}**

Realiza o pagamento de uma compra específica.

**Parâmetros:**

- `compraId`: ID da compra.

**Respostas:**

- `201`: Pagamento realizado com sucesso.
- `400`: Dados inválidos.

---

## Relatórios

### Gerar relatório de vendas

**POST /relatorios/vendas**

Gera um relatório de vendas para um período específico.

**Parâmetros:**

- `dataInicio`: Data inicial no formato brasileiro (DD/MM/YYYY).
- `dataFim`: Data final no formato brasileiro (DD/MM/YYYY).

**Respostas:**

- `200`: Relatório gerado com sucesso.

```json
{
  "message": "string",
  "compras": [
    {
      "produtos": [
        {
          "produtoId": 0,
          "quantidade": 0
        }
      ],
      "status": "string"
    }
  ],
  "totalVendas": 0,
  "totalReceita": 0
}
```

- `400`: Dados inválidos

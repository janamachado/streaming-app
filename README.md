# 🎵 Streaming Music App

Este é um projeto full-stack de uma aplicação de streaming de músicas, com foco na gestão de playlists e músicas. O sistema é dividido em duas partes:

    Frontend: Desenvolvido com React, Bootstrap e Vite
    Backend: Desenvolvido com Node.js, Express, Prisma e PostgreSQL

A aplicação permite que o usuário:

    🎵 Crie e exclua playlists personalizadas
    ➕ Adicione músicas às playlists a partir de um serviço externo (Deezer)
    🗑️ Remova músicas específicas de uma playlist
    🔍 Pesquise músicas por nome, artista ou gênero
    📄 Visualize detalhes das músicas e playlists em uma interface amigável

A API é documentada via Swagger, e o sistema conta com testes unitários e de integração tanto no frontend quanto no backend.

---

## 🧭 Índice

- [Backend](#backend)
- [Documentação da API](#documentacao-da-api)
- [Banco de Dados e Prisma](#banco-de-dados-e-prisma)
- [Execução com Docker](#executando-com-docker)
- [Frontend](#frontend)
- [Modelos](#modelos)
- [Testes](#testes)


## Backend

### Tecnologias

- Node.js >= 18
- Express.js
- PostgreSQL >= 14
- Prisma ORM
- Docker

### Executando o Projeto Localmente

1. Clone o repositório:
```bash
git clone https://github.com/janamachado/streaming-app
cd streaming-app/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/streaming_app?schema=public"
```

4. Execute as migrations:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run dev
```

> ⚠️ Certifique-se de ter o Node.js e PostgreSQL instalados localmente.

## Documentação da API

A documentação completa e interativa da API está disponível através do Swagger UI em:

```
http://localhost:3000/api-docs
```

Após iniciar o servidor, acesse esta URL para consultar todos os endpoints disponíveis, seus parâmetros, respostas, exemplos e testar as requisições diretamente pelo navegador.

## Banco de Dados e Prisma

### Configuração PostgreSQL

1. Instale o PostgreSQL
2. Crie um banco chamado `streaming_app`
3. Configure as credenciais no `.env`

### Comandos Prisma

```bash
# Inicializar Prisma
npx prisma init

# Gerar cliente Prisma
npx prisma generate

# Criar/atualizar tabelas
npx prisma migrate dev

# Popular banco com dados iniciais
npx prisma db seed

# Visualizar banco de dados
npx prisma studio
```

## Executando com Docker

### Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Passos

1. Clone e navegue até o projeto:
```bash
git clone https://github.com/janamachado/streaming-app.git
cd streaming-app/backend
```

2. Configure o arquivo `.env`:
```bash
cp .env.example .env
```

3. Inicie os containers:
```bash
docker-compose up -d
```

4. Execute as migrations:
```bash
docker-compose exec app npx prisma migrate dev
```

> O servidor estará disponível em `http://localhost:3000`

### Comandos Úteis

```bash
# Ver logs
docker-compose logs -f

# Acessar shell do container
docker-compose exec app sh

# Executar seed
docker-compose exec app npx prisma db seed

# Parar os containers
docker-compose down
```

## Frontend

### Tecnologias

- React 18
- Bootstrap 5
- Vite
- Vitest (testes)
- Testing Library
- Axios

### Executando o Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

> O frontend estará disponível em `http://localhost:5173`

### Funcionalidades

- 🎵 Listagem de músicas do Deezer
- 📝 Criação, edição e exclusão de playlists
- ➕ Adição de músicas às playlists
- 🔍 Busca por músicas e playlists
- 🗑️ Remoção de músicas das playlists

## Modelos

#### Playlist
| Campo       | Tipo           |
|-------------|----------------|
| id          | Int (PK)       |
| name        | String (25)     |
| description | String? (200)   |
| createdAt   | DateTime       |
| updatedAt   | DateTime       |

#### Song
| Campo      | Tipo     |
|------------|----------|
| id         | Int (PK) |
| externalId | String   |
| title      | String   |
| artist     | String?  |
| album      | String?  |
| duration   | Int?     |
| url        | String?  |
| cover      | String?  |
| createdAt  | DateTime |
| updatedAt  | DateTime |

#### PlaylistSong
| Campo      | Tipo     |
|------------|----------|
| id         | Int (PK) |
| playlistId | Int (FK) |
| songId     | Int (FK) |
| order      | Int?     |

## Testes

O projeto possui testes unitários e de integração. Para executar os testes:

```bash
# Executar todos os testes
npm test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration

# Executar testes com cobertura
npm run test:coverage
```

### Configuração do Ambiente de Testes

#### Banco de Dados de Teste

Os testes de integração necessitam de um banco de dados PostgreSQL dedicado para testes. Configure o arquivo `.env.test`:

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/streaming_app_test?schema=public"
```

> ⚠️ Importante: O banco de dados de teste é limpo automaticamente antes de cada teste.
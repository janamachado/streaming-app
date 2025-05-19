# 🎵 Streaming App - Backend

Este é o backend de uma aplicação de streaming de músicas, com foco na gestão de playlists e músicas. Desenvolvido com **Node.js**, **Express**, **Prisma** e banco de dados **PostgreSQL**.

## 🛠️ Tecnologias

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Docker

## 🚀 Executando o Projeto Localmente

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

## 🗄️ Banco de Dados e Prisma

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

## ⚙️ Testes

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

### Modelos

#### Song
| Campo     | Tipo     |
|-----------|----------|
| id        | Int (PK) |
| title     | String   |
| artist    | String   |
| album     | String   |
| duration  | Int      |
| createdAt | DateTime |

#### Playlist
| Campo       | Tipo     |
|-------------|----------|
| id          | Int (PK) |
| name        | String   |
| description | String   |
| songs       | Song[]   |
| createdAt   | DateTime |

---

### 📚 Documentação da API

A documentação interativa está disponível em `http://localhost:3000/api-docs` após iniciar o servidor.

### Endpoints

#### Músicas
| Método | Rota           | Descrição                     |
|--------|----------------|-------------------------------|
| GET    | `/api/song`    | Lista todas as músicas        |
| GET    | `/api/song/:id`| Retorna uma música específica |
| POST   | `/api/song`    | Cria uma nova música          |
| PUT    | `/api/song/:id`| Atualiza uma música           |
| DELETE | `/api/song/:id`| Remove uma música             |

#### Playlists
| Método | Rota                     | Descrição                      |
|--------|--------------------------|--------------------------------|
| GET    | `/api/playlists`         | Lista todas as playlists       |
| GET    | `/api/playlists/:id`     | Retorna uma playlist específica|
| POST   | `/api/playlists`         | Cria uma nova playlist         |
| PUT    | `/api/playlists/:id`     | Atualiza uma playlist          |
| DELETE | `/api/playlists/:id`     | Remove uma playlist            |

### 🔍 Filtros de Playlists

- **Por nome**: `/api/playlists?name=rock`
- **Por música**: `/api/playlists?songId=123`
- **Busca em nome/descrição**: `/api/playlists/search?query=festa`
- **Busca por música**: `/api/playlists/by-song?song=shape`

### 🔍 Filtros Disponíveis

#### Playlists
- **Filtrar por nome**: `/api/playlists?name=rock`
- **Filtrar por música**: `/api/playlists?songId=123`
- **Buscar em nome/descrição**: `/api/playlists/search?query=festa`
- **Buscar por música**: `/api/playlists/by-song?song=shape` (aceita ID ou título)

#### Songs
- **Filtrar por título**: `/api/song?title=shape`
- **Filtrar por artista**: `/api/song?artist=ed`

---

## 🐳 Executando com Docker

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

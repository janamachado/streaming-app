# 🎵 Streaming App - Backend

Este é o backend de uma aplicação de streaming de músicas, com foco na gestão de playlists e músicas. Desenvolvido com **Node.js**, **Express**, **Prisma** e banco de dados **PostgreSQL**.

---

## 📦 Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM

---

## 🚀 Como rodar o projeto localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/janamachado/streaming-app
cd streaming-app/backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar o arquivo `.env`

Crie um arquivo `.env` baseado no `.env.example`:

```
DATABASE_URL="postgresql://postgres:senha@localhost:5432/streaming_app?schema=public"
```

> ⚠️ Substitua os dados de conexão com os seus próprios.

---

## 🧩 Configuração do Banco de Dados

### Instalações necessárias

- Instale o **PostgreSQL** em sua máquina.
- Crie um banco chamado `streaming_app`.
- A senha e usuário devem constar no `.env`.

### Prisma

Para iniciar o Prisma:

```bash
npx prisma init
```

Para criar as tabelas no banco:

```bash
npx prisma migrate dev --name init
```

Para abrir o visualizador do banco:

```bash
npx prisma studio
```

### 🧬 Gerando os primeiros dados essenciais: seed

Após instalar as dependências e configurar o arquivo `.env`, é necessário gerar o Prisma Client com o comando:

```bash
npx prisma generate
```

Executar o script de seed:

```bash
npx prisma db seed
```
---

## 📁 Estrutura inicial do banco de dados

O banco atualmente possui dois modelos:

### `Song`

| Campo       | Tipo     |
|-------------|----------|
| id          | Int (PK) |
| title       | String   |
| artist      | String   |
| album       | String   |
| duration    | Int      |
| createdAt   | DateTime |

### `Playlist`

| Campo       | Tipo     |
|-------------|----------|
| id          | Int (PK) |
| name        | String   |
| description | String   |
| songs       | relação com Song[] |
| createdAt   | DateTime |

---

## 📚 Documentação da API

A API possui documentação interativa usando Swagger/OpenAPI. Para acessá-la:

1. Inicie o servidor:
   ```bash
   cd backend
   npm run dev
   ```

2. Acesse a documentação em:
   ```
   http://localhost:3000/api-docs
   ```

### 🔍 Recursos da Documentação

- Interface interativa para testar todos os endpoints
- Descrição detalhada de cada rota
- Exemplos de requisição e resposta
- Schemas dos modelos de dados
- Códigos de status e mensagens de erro

### 🎵 Songs

| Método | Rota           | Descrição                     |
|--------|----------------|-------------------------------|
| GET    | `/api/song`    | Lista todas as músicas        |
| GET    | `/api/song/:id`| Retorna uma música específica |
| POST   | `/api/song`    | Cria uma nova música          |
| PUT    | `/api/song/:id`| Atualiza uma música           |
| DELETE | `/api/song/:id`| Remove uma música             |

### 📚 Playlists

| Método | Rota                    | Descrição                           |
|--------|------------------------|-------------------------------------|
| GET    | `/api/playlists`       | Lista todas as playlists            |
| GET    | `/api/playlists/search`| Busca playlists por nome/descrição  |
| GET    | `/api/playlists/by-song`| Busca playlists por música         |
| GET    | `/api/playlists/:id`   | Retorna uma playlist específica     |
| POST   | `/api/playlists`       | Cria uma nova playlist              |
| PUT    | `/api/playlists/:id`   | Atualiza uma playlist              |
| DELETE | `/api/playlists/:id`   | Remove uma playlist                 |
| POST   | `/api/playlists/:id/songs` | Adiciona músicas à playlist     |
| DELETE | `/api/playlists/:id/songs` | Remove músicas da playlist      |

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

## ⚙️ O que é necessário para rodar em outra máquina

- Node.js instalado
- PostgreSQL instalado e configurado
- `.env` corretamente preenchido
- Rodar `npm install`
- Rodar as migrations com `npx prisma migrate dev`
- Rodar o servidor com `npm start` ou `node src/index.js`


// Continuar documentação.... //
--------------------------


Roteiro de Execução

Criar estrutura de pastas ok

Criar documento técnico com plano de execução ok

Criar JSON fictício com dados (melhorar mock)

Definir modelo relacional no banco (artistas, álbuns, músicas)

Definir/instalar dependências mínimas para o projeto

Etapa 2: Back-end – Node.js + Express + PostgreSQL

Configurar ambiente local (env, scripts)

Desenvolver CRUD
Criar rotas REST:

    POST, GET, PUT, DELETE /songs

    GET /songs/:id

    POST, GET, PUT, DELETE /playlists

    GET /playlists/:id

Deixar rotas funcionando ok

Conectar ao PostgreSQL via prisma ok
Criar JSON de dados (SONGS) songs e playlists
Criar migrations para tabelasok
Sistema de seeding dos dados no DB


Validação das rotas
Validação erros







Criar serviço externo opcional (Deezer API mais simples)

    Separar em services/ e isolar a lógica de requisição

    Cobertura mínima de testes unit e integração
-------------------------------------------------------------------------
DEPOIS

✅ Etapa 3: Front-end – React 

Criar layout funcional responsivo (pode usar Tailwind ou Bootstrap)

Consumir a API criada (usando axios ou fetch)

Listar músicas com preview (nome, artista, duração, imagem)

Criar página ou modal de detalhe da música

    (Extra) Página de álbuns e artistas

✅ Etapa 4: Refino e Extras (D5–D6)

Deploy simples (Render, Vercel ou Railway)

Refatorações, melhorias visuais e de código

Se der tempo: reimplementar o backend com Django Rest Framework (DRF)

back-end/
├── package.json
├── package-lock.json
├── Dockerfile
├── docker-compose.yml
├── .env
├── README.md
├── src/
│   ├── config/
│   │   └── database.js
│   │   └── env.js
│   │
│   ├── models/
│   │   └── User.js
│   │   └── Playlist.js
│   │   └── Music.js
│   │
│   ├── controllers/
│   │   └── userController.js
│   │   └── playlistController.js
│   │   └── musicController.js
│   │
│   ├── services/
│   │   └── externalApiService.js (pós)
│   │   └── playlistService.js
│   │
│   ├── routes/
│   │   └── userRoutes.js
│   │   └── playlistRoutes.js
│   │   └── musicRoutes.js
│   │
│   ├── middlewares/
│   │   └── errorHandler.js
│   │   └── authMiddleware.js
│   │
│   ├── tests/
│   │   └── unit/
│   │   └── integration/
│   │
│   └── index.js


front-end/
├── package.json
├── package-lock.json
├── vite.config.js / webpack.config.js
├── .env
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │   └── icons/
│
│   ├── components/
│   │   └── Header.jsx
│   │   └── MusicCard.jsx
│   │   └── PlaylistForm.jsx
│
│   ├── pages/
│   │   └── Home.jsx
│   │   └── PlaylistDetails.jsx
│
│   ├── services/
│   │   └── api.js              # Instância do Axios para chamadas ao back-end
│
│   ├── hooks/
│   │   └── usePlaylist.js
│
│   ├── context/
│   │   └── AuthContext.jsx
│
│   ├── styles/
│   │   └── global.css
│
│   ├── tests/
│   │   └── components/
│   │   └── pages/
│
│   └── main.jsx

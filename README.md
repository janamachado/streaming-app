# streaming-app

Roteiro de Execução

Criar estrutura de pastas ok

Criar documento técnico com plano de execução ok

Criar JSON fictício com dados (melhorar mock)

Definir modelo relacional no banco (artistas, álbuns, músicas)

Definir/instalar dependências mínimas para o projeto

Etapa 2: Back-end – Node.js + Express + PostgreSQL

Configurar ambiente local (env, scripts)

Deixar rotas funcionando ok
Validação das rotas
Validação erros

Conectar ao PostgreSQL via ORM typeOrm ou prisma?

Alternativa sem ORM: usar pg e SQL puro?

Criar migrations e seeds com dados mockados

Criar rotas REST:

    GET /songs

    GET /songs/:id

    GET /playlists

    GET /playlists/:id

    GET /artists

    GET /artists/:id

Desenvolver CRUD

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

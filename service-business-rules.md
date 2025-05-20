# 🎵 Regras de Negócio – Gerenciamento de Playlists

Este documento descreve as regras de negócio para a criação, edição e gerenciamento de playlists no sistema.

---

## 📌 POST `/playlists` – Criar uma playlist

### ✅ Regras de negócio
- `name`: **obrigatório**
- `description`: opcional
- `playlistSongs`: **opcional**
  - É permitido criar uma playlist **vazia**, sem músicas inicialmente.
  - Exemplo real: o usuário pode querer apenas nomear uma playlist como "Para ouvir no trânsito" e adicionar músicas depois.

### ⚠️ Validações
- Impedir duplicidade de nomes por usuário (ex: um mesmo usuário não pode ter duas playlists com o nome "Favoritas").
- (Opcional) Limite de músicas por playlist — exemplo: máximo de 500 músicas.

---

## 📌 GET `/playlists` – Listar todas as playlists

### ✅ Regras de negócio
- Retorna **apenas playlists do usuário logado**.
- Pode aceitar filtros opcionais:
  - `?name=...` → filtrar por parte do nome
  - `?songId=...` → playlists que contenham determinada música

### 🔒 Segurança
- O usuário **só pode ver suas próprias playlists**.

---

## 📌 GET `/playlists/:id` ou `/playlists/search`

### ❓ Buscar por ID ou por nome?

**Não faz sentido o usuário buscar por ID diretamente.** Então, duas abordagens podem coexistir:

### 1. `GET /playlists/:id`
- Útil para uso interno no sistema (frontend já sabe o ID e usa para acessar os detalhes da playlist).

### 2. `GET /playlists/search?query=`
- Permite busca por nome ou descrição parcial da playlist.
- Exemplo: `/playlists/search?query=trânsito`

👉 **Recomendado:** usar ambas.

---

## 📌 PUT `/playlists/:id` – Atualizar playlist

### ✅ O que pode ser editado
- `name`
- `description`
- `playlistSongs`:
  - Adicionar músicas
  - Remover músicas
  - (Opcional) Reordenar músicas

### ⚠️ Regras importantes
- Validar se as músicas existem.
- Impedir duplicidade de músicas na mesma playlist (exceto se for desejado).
- Apenas o **dono da playlist** pode editá-la.

---

## 📌 DELETE `/playlists/:id` – Excluir playlist

### ✅ Regras de negócio
- Remove a playlist por completo.
- **Não deleta as músicas do sistema** – apenas o relacionamento com a playlist.
- As músicas podem continuar existindo em outras playlists.

### ⚠️ Considerações
- Somente o **dono da playlist** pode excluí-la.
- (Opcional) Implementar **soft delete** caso deseje permitir recuperação posterior.

---

## 📌 POST `/playlists/:id/songs` – Adicionar músicas à playlist

### ✅ Regras de negócio
- Recebe um array de `songIds` no corpo da requisição
- Adiciona uma ou mais músicas à playlist existente
- Mantém a ordem sequencial das músicas
- Músicas duplicadas são automaticamente removidas da requisição

### ⚠️ Validações
- Verifica se a playlist existe
- Verifica se todas as músicas existem
- Valida se songIds é um array não vazio
- Verifica se as músicas já existem na playlist

---

## 📌 DELETE `/playlists/:id/songs` – Remover músicas da playlist

### ✅ Regras de negócio
- Recebe um array de `songIds` no corpo da requisição
- Remove uma ou mais músicas da playlist

### ⚠️ Validações
- Verifica se a playlist existe
- Verifica se todas as músicas estão na playlist
- Valida se songIds é um array não vazio

---

## 📌 GET `/playlists/by-song` – Buscar playlists por música

### ✅ Regras de negócio
- Permite buscar playlists que contêm uma música específica
- Aceita busca por ID da música ou por título
- Parâmetro `song` na query string

### 🔍 Exemplos
- Busca por ID: `/playlists/by-song?song=123`
- Busca por título: `/playlists/by-song?song=shape of you`

### ⚠️ Validações
- Parâmetro `song` é obrigatório
- Busca por título é case-insensitive
- Busca por título é parcial (contém)

---

## 📌 GET `/playlists` – Filtros adicionais

### 🔍 Parâmetros de filtro
- `name`: Filtra playlists por parte do nome
  - Exemplo: `/playlists?name=rock`
  - Case-insensitive
- `songId`: Filtra playlists que contêm uma música específica
  - Exemplo: `/playlists?songId=123`

### ✅ Características
- Filtros são opcionais
- Podem ser combinados
- Exemplo combinado: `/playlists?name=rock&songId=123`

---

## 🎁 Regras adicionais (opcionais)

- Criar uma nova playlist a partir de outra (duplicar).
- Compartilhar playlist com link público.
- Playlist colaborativa (edição por mais de um usuário) – **nível avançado**, pode ser ignorado no teste.

---

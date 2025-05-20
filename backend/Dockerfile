# Use a imagem oficial do Node.js como base
FROM node:20-alpine

# Cria e define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de configuração
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o Prisma Client
RUN npx prisma generate

# Copia o resto do código
COPY . .

# Expõe a porta que o app usa
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "run", "dev"]

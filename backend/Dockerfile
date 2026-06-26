FROM node:18-alpine

WORKDIR /app

# Instalar dependencias necesarias para build y prisma
COPY package*.json ./
RUN npm install

# Copiar el codigo fuente
COPY . .

# Generar cliente prisma
RUN npx prisma generate

# Exponer el puerto
EXPOSE 3000

# Iniciar servidor ejecutando migraciones primero
CMD ["sh", "-c", "npx prisma db push && npm run dev"]

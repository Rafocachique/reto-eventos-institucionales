FROM node:18-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el codigo fuente
COPY . .

# Exponer el puerto
EXPOSE 5173

# Arrancar Vite en host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host"]

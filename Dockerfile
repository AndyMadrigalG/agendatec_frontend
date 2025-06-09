###################################################
# Dockerfile for a minimal Alpine Linux image with Node.js
ARG NODE_VERSION=22.16
ARG ALPINE_VERSION=3.22

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

# Set the working directory for the build stage
WORKDIR /app

COPY package*.json ./

# Instalamos ÚNICAMENTE las dependencias de producción, esto reduce drásticamente el tamaño de la imagen
RUN npm install --omit=dev

COPY src ./src
COPY public ./public
COPY tsconfig*.json .

# Ejecutamos el comando de build para compilar el código
RUN npm run build

###################################################
# --- Etapa 2: Producción ---
# La imagen final que se ejecutará en producción sera mucho más ligera
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runtime
ENV NODE_ENV=production

WORKDIR /app

# Copiamos la aplicación ya compilada desde la etapa 'builder'
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "run", "start"]

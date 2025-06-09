###################################################
# Dockerfile for a minimal Alpine Linux image with Node.js
ARG NODE_VERSION=22.16
ARG ALPINE_VERSION=3.22

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

# Set the working directory for the build stage
WORKDIR /usr/src/app

COPY package*.json .
COPY src ./src
COPY tsconfig*.json .

# Instalamos ÚNICAMENTE las dependencias de producción, esto reduce drásticamente el tamaño de la imagen
RUN npm install --omit=dev

RUN npm run build

###################################################
# --- Etapa 2: Producción ---
# La imagen final que se ejecutará en producción sera mucho más ligera
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as runtime
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder package*.json .
COPY --from=builder src ./src
COPY --from=builder tsconfig*.json .

# Copiamos la aplicación ya compilada desde la etapa 'builder'
COPY --from=builder /usr/src/app/.next ./.next

CMD ["npm", "run", "start"]
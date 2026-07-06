# Stage 1: build
FROM node:22-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias sin auditorías y forzar la versión correcta de esbuild
RUN npm install --no-audit --no-fund \
    && npm install esbuild@0.28.1 --save-exact

# Copiar el resto del código
COPY . .

# Ejecutar la construcción
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist/learntrack-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
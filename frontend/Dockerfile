# Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose
EXPOSE 80

# Init
CMD ["nginx", "-g", "daemon off;"]

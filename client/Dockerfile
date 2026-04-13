FROM node:20-alpine AS builder

WORKDIR /app

COPY client/package*.json ./
RUN npm ci

COPY client/ .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

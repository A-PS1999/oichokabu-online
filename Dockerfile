# Build stage
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Embedded by Vite into the frontend bundle at build time
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build
RUN npm run build:server

# Run stage
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/build ./build
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/db ./server/db
COPY --from=builder /app/public ./public
COPY --from=builder /app/.sequelizerc ./.sequelizerc

EXPOSE 5000
CMD ["node", "server/dist/initServer.js"]
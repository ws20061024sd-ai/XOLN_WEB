FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --registry=https://registry.npmmirror.com
COPY tsconfig.json ./
COPY src/ src/
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --registry=https://registry.npmmirror.com
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]

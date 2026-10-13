FROM node:22-alpine AS build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --registry=https://registry.npmmirror.com
COPY server/tsconfig.json ./
COPY server/src/ src/
COPY shared/ /app/shared/
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app/server
ENV NODE_ENV=production
COPY server/package*.json ./
RUN npm ci --omit=dev --registry=https://registry.npmmirror.com
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/shared /app/shared
EXPOSE 3001
CMD ["node", "dist/index.js"]

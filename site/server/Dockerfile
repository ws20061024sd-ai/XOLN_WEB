FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install --registry=https://registry.npmmirror.com
COPY dist/ dist/
EXPOSE 3001
CMD ["node", "dist/index.js"]

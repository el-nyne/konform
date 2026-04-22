FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
COPY data ./data
ENV PORT=8083
EXPOSE 8083
CMD ["npm", "start"]

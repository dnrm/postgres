FROM node:14
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN npm install --production
COPY . .
EXPOSE 9090
ENV PORT=80
CMD ["node", "."]
FROM node:21-alpine

# アプリケーションディレクトリを作成する
WORKDIR /app

# アプリケーションの依存関係をインストールする
COPY package*.json ./
RUN npm install

# アプリケーションのソースをバンドルする
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]

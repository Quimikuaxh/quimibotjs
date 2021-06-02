FROM arm32v7/node:current-slim
RUN npm install
RUN node ./bot.js
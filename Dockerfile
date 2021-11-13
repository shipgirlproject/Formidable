from mhart/alpine-node:latest as deps
WORKDIR deps
copy package.json package-lock.json ./
RUN npm install --include=production

from mhart/alpine-node:slim
ENV PORT 8080
WORKDIR prod
COPY --from=deps /deps/node_modules ./node_modules
copy . .
EXPOSE 8080
CMD ["node", "/prod/index.js"]
FROM node:lts as builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build


# Build the image as production
# So we can minimize the size

FROM node:lts-slim as runner
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]

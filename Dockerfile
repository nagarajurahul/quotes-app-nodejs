# -------- Base image --------
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# -------- Dependencies layer --------
FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev

# -------- Build layer --------
FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# RUN npm run build  # (optional)

# -------- Runtime layer --------
FROM node:22-alpine AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production

RUN apk add --no-cache dumb-init

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src

RUN addgroup -S app && adduser -S app -G app \
  && chown -R app:app /usr/src/app
USER app

EXPOSE 8080

CMD ["dumb-init", "node", "src/server.js"]

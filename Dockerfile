# -------- Base image --------
FROM node:24-alpine AS base
WORKDIR /usr/src/app

# -------- Dependencies layer --------
FROM base AS dependencies
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev

# -------- Build layer --------
FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
# RUN npm run build  # (optional)

# -------- Runtime layer --------
FROM node:24-alpine AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install only runtime OS deps + remove npm to eliminate glob (CVE-2025-64756 – HIGH)
RUN apk add --no-cache dumb-init tzdata \
  && rm -rf /usr/local/lib/node_modules/npm \
  /usr/local/lib/node_modules/corepack

COPY --from=build /usr/src/app ./

RUN addgroup -S app && adduser -S app -G app \
  && chown -R app:app /usr/src/app
USER app

EXPOSE 3000

CMD ["dumb-init", "node", "src/server.js"]

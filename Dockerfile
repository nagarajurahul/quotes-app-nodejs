# -------- Base image --------
FROM node:22-alpine AS bash
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
# If you had a build step, run it here
# RUN npm run build

# -------- Runtime layer --------
FROM base AS runtime
ENV NODE_ENV=production

# App Service injects $PORT (default 8080). Don’t override it.
# Just respect it in server.js.

RUN apk add --no-cache dumb-init

# Copy only what’s needed for runtime
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src

# Drop privileges
RUN addgroup -S app && adduser -S app -G app \
  && chown -R app:app /usr/src/app
USER app

EXPOSE 8080

CMD ["dumb-init", "node", "src/server.js"]

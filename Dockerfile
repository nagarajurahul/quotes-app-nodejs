# -------- Base image --------
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# -------- Dependencies layer --------
FROM base AS deps
# Install OS deps for node-gyp builds
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev

# -------- Build layer --------
FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# (Optional: If you had a build step like TS/Next.js, it would go here)
# RUN npm run build

# -------- Runtime layer --------
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000

# Install dumb-init for proper PID 1 handling
RUN apk add --no-cache dumb-init

# Copy only what’s needed for runtime
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src

# Drop root privileges
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000

# Healthcheck (expects /health endpoint in your app)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start app
CMD ["dumb-init", "node", "src/server.js"]

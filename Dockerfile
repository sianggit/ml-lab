# syntax=docker/dockerfile:1.4.0

########################
# 1. Base image
########################
FROM node:18-bullseye-slim AS base

########################
# 2. Dependencies
########################
FROM base AS deps
RUN apt-get update && apt-get install -y \
    libc6 \
    libvips \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=optional

RUN npm install --os=linux --cpu=x64 sharp@latest --force

########################
# 3. Build
########################
FROM base AS builder
WORKDIR /app
USER root
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass environment file dynamically (default: .env.production)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG ENV_FILE=.env.production
COPY ${ENV_FILE} .env
RUN rm -f .env.production

RUN test -f .env || (echo ".env file missing!" && exit 1)
RUN --mount=type=cache,target=./.next/cache \
    npm run build

########################
# 4. Production runner
########################
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD HOSTNAME="0.0.0.0" node server.js
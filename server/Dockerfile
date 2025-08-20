# syntax=docker/dockerfile:1

# ----------- Build Arguments -----------
ARG NODE_VERSION=20-alpine
ARG YARN_VERSION=4.6.0

# ----------- Base Stage -----------
FROM node:${NODE_VERSION} AS base
WORKDIR /app

# ----------- Builder Stage -----------
FROM base AS builder
RUN corepack enable && corepack prepare yarn@${YARN_VERSION} --activate
WORKDIR /app

# Copy only package.json and yarn.lock for dependency installation
COPY --link package.json yarn.lock ./

# Configure Yarn cache directory
ENV YARN_CACHE_FOLDER=/usr/local/share/.cache/yarn

# Install dependencies (including dev dependencies for build)
RUN --mount=type=cache,target=${YARN_CACHE_FOLDER} \
    yarn install --frozen-lockfile

# Copy source files (excluding .env, .git, lock files, etc. via .dockerignore)
COPY --link tsconfig.json ./
COPY --link src ./src

# Build TypeScript
RUN yarn build

# Install production dependencies
RUN yarn install --production --frozen-lockfile

# ----------- Production Stage -----------
FROM node:${NODE_VERSION} AS final
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S -G appgroup appuser
USER appuser

# Set environment variables for production
ENV NODE_ENV=production
# Forces Node.js to reject unauthorized (invalid or self-signed) TLS/SSL certificates.
# ENV NODE_TLS_REJECT_UNAUTHORIZED=1
# Limits the maximum memory usage for the Node.js process to 4096 MB (4 GB)
# ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy only necessary files and built output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 8000

# Start the server
CMD ["node", "dist/index.js"]

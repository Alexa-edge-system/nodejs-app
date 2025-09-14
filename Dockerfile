# ---------- STAGE 1: builder ----------
# Use official Node LTS for building (includes npm)
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies (use npm ci for reproducible installs)
# If you need devDependencies for a build, keep default. For pure production build,
# you can set NODE_ENV=production later in the runtime stage.
RUN npm ci --silent

# Copy rest of the app
COPY . .

# If your app needs a build step (uncomment):
# RUN npm run build

# ---------- STAGE 2: runtime ----------
FROM node:20-alpine AS runtime

# Create non-root user (alpine 'node' user exists, but we'll create/ensure)
# Use node user that comes with the official image or create one if necessary.
# Here we use node user that exists in the Node official image.
USER node

WORKDIR /home/node/app

# Copy only necessary files from builder (node_modules + built assets or source)
# If you ran a build, copy built assets; otherwise copy source and node_modules.
COPY --chown=node:node --from=builder /usr/src/app . 

# If your app is purely server-side and you want production deps only:
# RUN npm prune --production

# Expose the app port (keeps your original 9981)
EXPOSE 9981

# Healthcheck - adjust path if your app provides a health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:9981/ || exit 1

# Use exec form so Node is PID 1 (better signal handling)
CMD ["node", "app.js"]

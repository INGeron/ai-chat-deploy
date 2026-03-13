# Stage 1: Build the Client
FROM oven/bun:1.2-slim AS client-builder
WORKDIR /app/client
COPY client/package.json client/bun.lock* ./
RUN bun install
COPY client/ ./
RUN bun run build

# Stage 2: Build the Server
FROM oven/bun:1.2-slim AS server-builder
WORKDIR /app/server
COPY server/package.json server/bun.lock* ./
RUN bun install
COPY server/ ./
RUN bun run build

# Stage 3: Production
FROM oven/bun:1.2-slim AS runner
WORKDIR /app

# Copy built server
COPY --from=server-builder /app/server/package.json ./
COPY --from=server-builder /app/server/node_modules ./node_modules
COPY --from=server-builder /app/server/dist ./dist

# Copy built client to server's public folder
COPY --from=client-builder /app/client/dist ./public

EXPOSE 3000

CMD ["bun", "dist/main.js"]

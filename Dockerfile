# syntax=docker/dockerfile:1.7

# ---- builder: install deps + build the SPA ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --prefer-offline --legacy-peer-deps
COPY . .
ARG BUILD_SHA=unknown
ENV VITE_BUILD_SHA=$BUILD_SHA \
    NODE_ENV=production
RUN npm run build

# ---- runner: nginx serving static files ----
FROM nginx:1.27-alpine AS runner
ARG BUILD_SHA=unknown
ENV BUILD_SHA=$BUILD_SHA
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/healthz >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]

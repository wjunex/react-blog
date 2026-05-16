# =========================
# 1. 构建阶段
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖（利用缓存）
COPY package*.json ./
RUN npm install

# 拷贝源码
COPY . .

# 构建 Next.js
RUN npm run build


# =========================
# 2. 运行阶段
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Next standalone 必需文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口（容器内）
EXPOSE 8080

# 启动 Next.js
CMD ["node", "server.js"]
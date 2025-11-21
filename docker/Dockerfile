# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖配置
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 运行阶段
FROM node:18-alpine

ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

WORKDIR /app

# 安装Prisma引擎
RUN apk add --no-cache openssl

# 复制生产依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 复制构建产出
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/main"]
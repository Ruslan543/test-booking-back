# FROM node:18

# # Set working directory
# WORKDIR /app

# # Copy package definitions and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy all application files
# COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# # Build the application
# RUN npm run build

# # Expose the application port
# EXPOSE 4000

# # On container start: run migrations then launch the app
# CMD ["sh", "-c", "npx prisma db push && node dist/main"]

# Этап сборки
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только package.json и package-lock.json для кэширования npm ci
COPY package*.json ./

# Ставим зависимости
RUN npm ci

# Копируем остальные файлы приложения и Prisma-схему
COPY . .

# Генерируем клиент Prisma (при изменении схемы будет задействован шаг заново)
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Этап рантайма
FROM node:18-alpine AS runner

WORKDIR /app

# Копируем только необходимые для запуска файлы из билдера
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Переменные окружения (пример)
ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# При старте сначала пушим схему в БД, затем запускаем
ENTRYPOINT ["sh", "-c", "npx prisma db push && node dist/main"]

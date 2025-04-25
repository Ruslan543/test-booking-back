# FROM node:18
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build
# EXPOSE 4000
# # CMD ["node", "dist/main"]
# CMD ["npm", "run", "start:migrate"]

# Используем официальный образ Node.js (версия 18, совпадающая с вашей средой)
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем Prisma schema и миграции
COPY prisma ./prisma/

# Копируем остальной код приложения
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Компилируем TypeScript (если используете TypeScript)
RUN npm run build

# Указываем порт, который будет использоваться (Render ожидает порт из переменной окружения)
EXPOSE 4000

# Применяем миграции и запускаем приложение
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate dev --name init && node dist/main"]

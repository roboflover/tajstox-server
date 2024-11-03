# Используем официальный образ Node.js
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install 

# Копируем код приложения
COPY . .

# Собираем приложение (если используется Next.js)
RUN npm run build

# Открываем порт для Next.js приложения
EXPOSE 8085

# Запускаем приложение
CMD ["npm", "start"]

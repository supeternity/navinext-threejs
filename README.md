# Navinext frontent documentation 

## Структура проекта
Базируется на [Three.js Webpack ES6](https://github.com/paulmg/ThreeJS-Webpack-ES6-Boilerplate/)

```
build - Директория для финальной сборки приложения
src - Исходные файлы приложения
├── css - Ассеты SCSS
├── js - Все возможные файлы приложения treejs, точка входа `app.js` 
│   ├── app
│   │   ├── components - Компоненты
│   │   ├── helpers - Хэлперы для компонентов
│   │   ├── managers - Пользовательский интерфейс / Ввод|Вывод
│   │   └── model - 3D json
│   ├── data - Конфиги и другие статические данные
│   └── utils - Вендоры
└── public - Системная папка webpack
```

## Установка и запуск
Зависимости:

```
npm install
```

Запуск сервера разработки:

```
npm run dev
```

Запуск по адресу localhost:8080, автоматическая пересборка по изменению файлов.

## Build
```
npm run build
```

Очистка директории build, последующие копирование файлов из public и минификация.

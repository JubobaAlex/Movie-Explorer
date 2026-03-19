# 🎬 Movie Explorer - приложение для поиска фильмов

## О проекте
Movie Explorer - это веб-приложение для поиска и просмотра информации о фильмах. Проект создан в рамках тестового задания. Приложение позволяет пользователям просматривать популярные фильмы, фильтровать их по жанрам, году выпуска и рейтингу, а также получать подробную информацию о каждом фильме.

## 🛠 Технологии
- **React 18** - функциональные компоненты и хуки
- **TypeScript** - статическая типизация
- **Redux Toolkit** - управление состоянием
- **Axios** - HTTP-клиент для работы с API
- **CSS Modules** - стилизация компонентов
- **React Router DOM v6** - навигация
- **Vercel** - хостинг и серверные функции
- **Custom API Proxy** - собственный прокси-сервер для обхода CORS

## 🚀 Функционал
✅ Просмотр списка популярных фильмов с пагинацией  
✅ Фильтрация фильмов по жанрам, году выпуска и рейтингу  
✅ Детальная страница фильма с полной информацией  
✅ Адаптивная верстка под все устройства  
✅ Загрузка данных из официального API Кинопоиска  
✅ Собственный API-прокси на Vercel для безопасных запросов  
✅ Сохранение состояния фильтров в Redux  
✅ Страница 404  

## 🔌 Работа с API

### API Кинопоиска
Проект использует официальное API Кинопоиска ([kinopoisk.dev](https://kinopoisk.dev/)). Для работы с API создан **собственный прокси-сервер** на Vercel, который решает проблему CORS и скрывает API ключ от клиента.

### Архитектура запросов
```
Клиент → Свой прокси (Vercel) → API Кинопоиска → Ответ → Клиент
```

### Пример запроса к API
```javascript
// API endpoint: https://api.kinopoisk.dev/v1.4/movie
// Параметры запроса:
// - page: номер страницы
// - limit: количество фильмов на странице
// - selectFields: выбираемые поля (id, name, year, rating, poster, genres, description, movieLength)
// - notNullFields: поля, которые не могут быть null (name, poster.url, rating.kp)
// - rating.kp: диапазон рейтинга (например: 7-10)
// - year: диапазон года выпуска (например: 2000-2023)
// - genres.name: фильтрация по жанрам (например: комедия, драма)
```

## Настройка переменных окружения

### 1. Создайте файл `.env` в корне проекта
### 2. Заполните его следующими значениями:
```env
REACT_APP_KINOPOISK_API_KEY=ваш_ключ_API_Кинопоиска
```

### Получение API ключа
Для получения ключа API Кинопоиска:
1. Зарегистрируйтесь на [kinopoisk.dev](https://kinopoisk.dev/)
2. Получите API ключ в личном кабинете
3. Вставьте полученный ключ в переменную `REACT_APP_KINOPOISK_API_KEY`

## 📥 Установка и запуск

### Клонирование репозитория
```bash
git clone https://github.com/JubobaAlex/movie-explorer.git
cd movie-explorer
```

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm start
```
Приложение будет доступно по адресу `http://localhost:3000`

### Сборка для production
```bash
npm run build
```

### Деплой на Vercel
```bash
vercel
```

## 📁 Структура проекта
```
src/
├── components/         # Переиспользуемые компоненты
│   ├── MovieCard/     # Карточка фильма
│   ├── MovieList/     # Список фильмов
│   ├── Filters/       # Компоненты фильтров
│   └── Pagination/    # Пагинация
├── pages/             # Страницы приложения
│   ├── MainPage/      # Главная страница с фильмами
│   ├── MoviePage/     # Детальная страница фильма
│   └── NotFoundPage/  # Страница 404
├── store/             # Redux store и слайсы
│   ├── slices/        # Redux слайсы
│   └── store.ts       # Конфигурация store
├── api/               # Работа с API
│   ├── kinopoiskApi.ts # Настройка axios и запросы
│   └── types.ts       # Типы для API
├── types/             # TypeScript типы
├── styles/            # Глобальные стили
└── utils/             # Вспомогательные функции

api/                    # Serverless функции Vercel
└── proxy.js           # Прокси для API Кинопоиска
```

## ⚙️ Особенности реализации

### Решение проблемы CORS
В проекте используется **собственный прокси-сервер** на Vercel:

```typescript
// Клиентский код
const apiUrl = `https://api.kinopoisk.dev/v1.4/movie?${queryString}`;
const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
const response = await api.get(proxyUrl);
```

```javascript
// Серверный прокси (api/proxy.js)
export default async function handler(req, res) {
  const response = await fetch(decodeURIComponent(url), {
    headers: { 'X-API-KEY': process.env.REACT_APP_KINOPOISK_API_KEY }
  });
  const data = await response.json();
  res.status(200).json(data);
}
```

Преимущества такого подхода:
- ✅ Полное отсутствие CORS-ошибок
- ✅ API ключ хранится только на сервере
- ✅ Высокая надежность
- ✅ Контроль над запросами

### Управление состоянием
Redux Toolkit используется для хранения:
- Списка фильмов
- Текущей страницы
- Выбранных фильтров
- Состояния загрузки

### Типизация
Весь код написан на TypeScript с полной типизацией всех компонентов, пропсов и ответов от API.

## 🌐 Демо
https://movie-explorer-dw04o9hlu-jubobaalexs-projects.vercel.app/?ratingFrom=0&ratingTo=10&yearFrom=1990&yearTo=2026

## Автор
**JubobaAlex**  

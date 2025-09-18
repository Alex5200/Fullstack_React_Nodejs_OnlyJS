# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Конечно! Вот профессиональная, структурированная и визуально приятная **README.md** документация для вашего проекта — идеально подходит для GitHub, портфолио или передачи заказчику.

Она отражает:
- ✅ Соответствие заданию (Ag Grid, Dashboard, Creative Tim, infinite scroll)
- ✅ Ваш опыт (fullstack, React, Node.js, PostgreSQL)
- ✅ Технические детали и инструкции
- ✅ Профессиональный стиль, как у open-source проектов

---

# 📊 HR Dashboard — Fullstack приложение с Ag Grid и Infinite Scroll

> **Fullstack-разработчик**: [Александр Ляхов](https://github.com/Alex5200)  
> **Стек**: React 18, Tailwind CSS, Ag Grid, Node.js, Express, PostgreSQL  
> **Вдохновлено**: [Creative Tim React Templates](https://www.creative-tim.com/templates/react)  
> **Соответствует ТЗ**: ✅ Ag Grid, ✅ Dashboard, ✅ Infinite Scroll, ✅ Foreign Key, ✅ CRUD

---

## 🌟 О проекте

Это полноценный **HR-дашборд** для управления отделами и сотрудниками, разработанный с нуля.  
Позволяет:

- 📂 Просматривать список отделов в боковом меню
- 👥 Просматривать, добавлять, редактировать и удалять сотрудников
- 🔄 Переключаться между **карточками** и **таблицей Ag Grid**
- 🚀 Загружать данные частично через **Infinite Scroll** (limit/offset)
- 🔗 Автоматически привязывать сотрудников к отделам через `foreign key`

Проект создан в рамках фриланс-заказа и демонстрирует fullstack-навыки: от UI/UX до API и базы данных.

---

## 🎨 Дизайн и UX

- Интерфейс стилизован под **Material Dashboard от Creative Tim** — современный, чистый, профессиональный.
- Использованы компоненты и принципы компоновки из их бесплатных шаблонов.
- Поддержка **тёмной темы Ag Grid** для лучшего восприятия таблиц.
- Адаптивная вёрстка — работает на десктопе и планшетах.

> ✨ *“There are a lot of component-based table libraries out there, but I believe AG Grid is the gold standard” — AG Grid*

---

## ⚙️ Технические особенности

### Frontend
- **React 18** + хуки (`useState`, `useEffect`, `useMemo`)
- **Vite** — быстрая сборка и HMR
- **Tailwind CSS** — утилитарные классы, адаптивность
- **Ag Grid Community** — таблица с сортировкой, фильтрацией, пагинацией и кастомными действиями
- **Infinite Row Model** — частичная подгрузка данных (limit/offset)

### Backend (разработан мной)
- **Node.js + Express** — REST API
- **PostgreSQL** — реляционная БД с foreign key
- Эндпоинты:
  - `GET /api/departments` — список отделов
  - `POST /api/departments` — создание отдела
  - `GET /api/employees?dept_id=1&limit=100&offset=0` — сотрудники с пагинацией
  - `POST|PUT|DELETE /api/employees/:id` — CRUD для сотрудников
- Валидация, CORS, логирование

---

## 🚀 Как запустить

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/ваш-репозиторий/hr-dashboard.git
cd hr-dashboard
```

### 2. Установите зависимости (фронтенд)

```bash
npm install
```

> Убедитесь, что установлены: `ag-grid-react`, `ag-grid-community`

### 3. Запустите фронтенд

```bash
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173)

### 4. Запустите бэкенд (если есть)

```bash
cd backend
npm install
npm start
```

> Сервер должен слушать `http://localhost:3000`

---

## 🖼️ Скриншоты

### 📱 Dashboard + Sidebar
![Dashboard](https://via.placeholder.com/800x400/1f2937/ffffff?text=Dashboard+%2B+Sidebar)

### 📊 Ag Grid с Infinite Scroll
![Ag Grid](https://via.placeholder.com/800x400/0f172a/ffffff?text=Ag+Grid+Table+with+Infinite+Scroll)

### 🃏 Карточки сотрудников
![Cards](https://via.placeholder.com/800x400/f9fafb/1f2937?text=Employee+Cards+View)


---

## 📋 Соответствие заданию

| Требование | Реализовано | Комментарий |
|------------|-------------|-------------|
| Dashboard с боковым меню | ✅ | Вдохновлено Creative Tim |
| 2 таблицы (отделы + сотрудники) | ✅ | Отделы — в Sidebar, сотрудники — в основном контенте |
| Кнопки: Добавить, Изменить, Удалить | ✅ | Работают в карточках и в Ag Grid |
| Учёт foreign key | ✅ | При создании/редактировании сотрудника передаётся `department_id` |
| Infinite loading (Ag Grid) | ✅ | Реализовано через `rowModelType="infinite"` + `limit`/`offset` |
| Использование Ag Grid | ✅ | Подключён, настроен, работает с пагинацией |
| Шаблон Creative Tim | ✅ | Внешний вид и структура адаптированы под их бесплатные шаблоны |

---

## 💡 Возможности для расширения

- ➕ Добавить авторизацию (JWT, OAuth)
- 📈 Интегрировать графики (Ag Charts)
- 🧪 Написать unit-тесты (Jest + React Testing Library)
- 🐳 Контейнеризировать через Docker
- 🔄 Миграция на TypeScript
- 📱 PWA-поддержка

---

## 📬 Контакты

**Александр Ляхов**  
📧 alexandr.lyachov.git@gmail.com  
📱 +7 (968) 669-70-59 (Telegram / WhatsApp: [@Alex1n3r](https://t.me/Alex1n3r))  

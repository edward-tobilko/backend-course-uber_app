# 📘 Backend Course – Express REST API

A ***Node.js + Express + TypeScript*** learning project that demonstrates how to build a REST API with CRUD operations.
It is ideal as a starting point for your own backend projects.

---

## 📦 Installation and launch
```bash
git clone https://github.com/edward-tobilko/backend-course.git
cd backend-course
yarn install
```

### Development mode
```bash
yarn dev
```

### Debug-mode
```bash
yarn debug
```

### Compilation and production
```bash
yarn build
yarn start
```

#### The server starts by default on http://localhost:3007/courses.

## 📌 API Routes
Courses
- GET /courses – get all courses (filtering by ?name=)
- GET /courses/:id – get a course by ID
- POST /courses – create a new course ({ "name": "front-end" })
- PUT /courses/:id – complete course update
- PATCH /courses/:id – partially update a course (name field)
- DELETE /courses/:id – delete a course

### 📂 Структура проєкту
```typescript
backend_course/
 ├── server.ts          # Main server file
 ├── package.json       # Scripts and dependencies
 ├── tsconfig.json      # TypeScript config
 ├── yarn.lock          # Dependency versions
 ├── dist/              # Built files (after build)
 └── node_modules/      # Dependencies
```

### ⚙️ Technologies
- express@5.1.0 – web framework
- typescript@5.9.2 – typification
- nodemon + tsx – hot restart at dev
- rimraf – cleaning dist before assembly

### 📖 Notes
- The code is written in the style of a modular API with CRUD.
- A static in-memory database (dataBase) is used instead of a real database.
- It can be easily adapted to PostgreSQL/MongoDB.

### 📖 Author
eduard.tobilko
#### 🔗 [GitHub] - https://github.com/edward-tobilko

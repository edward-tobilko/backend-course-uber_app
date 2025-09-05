# 📘 Backend Course

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
yarn debug:build
```

### Compilation and production
```bash
yarn build
yarn start
```

#### The server starts by default on http://localhost:3007/courses or https://backend-course-0wnd.onrender.com/

### 📂 Project structure
```typescript
src/
 ├── __tests__/               # E2E and unit-tests
 │   └── courses.e2e.test.ts
 │
 ├── config/                  # Environment settings
 │   └── env.ts
 │
 ├── controllers/             # Controllers (accept HTTP requests)
 │   └── courses.controller.ts
 │
 ├── db/                      # In-memory db or connection to a db
 │   └── courses.db.ts
 │
 ├── middlewares/             # Middleware (validation, logging, errors)
 │   └── courses.middleware.ts
 │
 ├── repositories/            # Repositories (working with data)
 │   └── courses.repo.ts
 │
 ├── routes/                  # Routers (routes API)
 │   └── courses.route.ts
 │
 ├── services/                # Business logic (BLL)
 │   └── courses.service.ts
 │
 ├── types/                   # TypeScript
 │   ├── course.types.ts
 │   └── index.d.ts
 │
 ├── utils/                   # Utils
 │   ├── http-codes.ts
 │   ├── logger.ts
 │   └── normalize.ts
 │
 ├── validators/              # Data validation
 │   └── courses.schema.ts
 │
 ├── app.ts                   # Initialization of the Express application
 └── server.ts                # Entry point (start server)

theory/                       # Learning materials/drafts
.env.example                  # Example environment variables
.gitignore                    # Ignored files
eslint.config.js              # ESLint settings
package.json                  # Dependencies and scripts
tsconfig.json                 # TypeScript config
tsconfig.build.json           # Build config
yarn.lock                     # Dependency versions
```

### ⚙️ Tech Stack
- Express
- Node >= 20v
- TypeScript
- cross-env + TSX
- rimraf
- dotenv

### 📖 Author
eduard.tobilko

#### 🔗 [GitHub] - https://github.com/edward-tobilko

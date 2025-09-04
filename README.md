# Backend Course – Express + TypeScript Setup

## 🚀 Launch in development mode - yarn dev:
Uses nodemon + tsx.
Automatic restart when .ts files change.
TypeScript is executed directly without building into dist/.

## 🐞 Run with debugger – yarn debug:
Starts the server with --inspect (port 9229).
You can connect Chrome DevTools (chrome://inspect) or VS Code.
Breakpoints work directly in .ts files.

## 📦 Production mode - yarn build and yarn start:

- **build** – compiles TypeScript into dist/.
- **start** – runs the compiled JS through Node.

Used only in production, without nodemon and without debugger.

## 🛠 Structure:

```typescript
backend_course/
 ├── server/        # source .ts files (entry point: server.ts)
 ├── src/           # additional modules/pages
 ├── dist/          # generated JS (created after build)
 ├── package.json   # scripts and dependencies
 └── tsconfig.json  # TypeScript configuration
```

- **rimraf** - deletes the old dist and generates a new one when running yarn build.

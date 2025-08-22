import http = require("http");
import path = require("path");
import { promises as fileSystem } from "fs";

let requestsCount = 0;

// *Уникаємо дублювання запитів при оновленні сторінки
const COUNTABLE = new Set(["/", "/orders", "/items"]); // що рахуємо

// *Базові теки
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PAGES_DIR = path.join(ROOT, "src", "pages");

//* Допоміжні асинхронні ф-ї (helper async func)
const readFile = async (
  response: http.ServerResponse,
  filePath: string,
  contentType: string,
  status: number,
): Promise<void> => {
  if (response.headersSent) return;

  try {
    const data = await fileSystem.readFile(filePath); // *зчитує весь файл у пам'ять

    response.writeHead(status, {
      "Content-Type": contentType,
    });

    response.end(data);
  } catch (error) {
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });

      response.end("500 Internal Server Error");
    }
  }
};

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

const server = http.createServer(async (request, response) => {
  const url = request.url ?? "/";

  // *favicon для title вкладки браузера
  if (url === "/favicon.ico") {
    const icoPath = path.join(PUBLIC_DIR, "favicon.ico");
    const svgPath = path.join(PUBLIC_DIR, "favicon.svg");

    try {
      await fileSystem.access(icoPath);
      await readFile(response, icoPath, "image/x-icon", 200);
    } catch {
      try {
        await fileSystem.access(svgPath);
        await readFile(response, svgPath, "image/svg+xml", 200);
      } catch {
        response.writeHead(204);
        response.end();
      }
    }

    return;
  }

  // *інкрементуємо лише «корисні» шляхи
  if (COUNTABLE.has(url)) requestsCount++;

  switch (url) {
    case "/":

    case "/orders": {
      const file = path.join(PAGES_DIR, "orders.html");

      await readFile(response, file, "text/html; charset=utf-8", 200);

      return; // важливо, щоб не пішло далі
    }

    case "/items": {
      const file = path.join(PAGES_DIR, "items.html");

      await delay(3000);
      await readFile(response, file, "text/html; charset=utf-8", 200);

      return; // важливо, щоб не пішло далі
    }

    default: {
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.write("404 not found" + requestsCount);

      response.end();

      return; // важливо, щоб не пішло далі
    }
  }
});

server.listen(3007, () =>
  console.log("Server running on http://localhost:3007"),
);

// ! ПОЯСНЕННЯ
// ? Content-Type - це метадані, який ми відправляємо, щоб сказати браузеру чи клієнту, який саме формат даних ти йому відправляєш ( див. в network ).
// ? fs — File System module у Node.js - дозволяє працювати з файлами: читати, записувати, створювати папки, перевіряти існування тощо.
// ? buffer — це "сирі байти" файлу (наприклад, картинки або іконки), потім ми передаємо цей buffer прямо у res.end(buffer) і браузер отримує правильний файл.
// ? npx autocannon -c 3 -d 5 http://localhost:3007/items - для перевірки асинхронності відкриття вкладок в браузері ( Тут -n 3 = 3 запити, -c 3 = одночасно. Всі три мають завершитися за ~5 сек. ). Тестується в терміналі!

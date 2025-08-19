import http = require("http");
import path = require("path");
import fileSystem = require("fs");

let requestsCount = 0;

// *Уникаємо дублювання запитів при оновленні сторінки
const COUNTABLE = new Set(["/", "/orders", "/items"]); // що рахуємо

const server = http.createServer((request, response) => {
  const url = request.url ?? "/";

  // *favicon для title вкладки браузера
  if (url === "/favicon.ico") {
    const svgPath = path.join(__dirname, "..", "public", "favicon.svg");
    const icoPath = path.join(__dirname, "..", "public", "favicon.ico");

    try {
      if (fileSystem.existsSync(icoPath)) {
        const buffer = fileSystem.readFileSync(icoPath); // *зчитує весь файл у пам'ять

        response.writeHead(200, {
          "Content-Type": "image/x-icon",
          "Cache-Control": "public, max-age=86400",
        });

        return response.end(buffer);
      }

      if (fileSystem.existsSync(svgPath)) {
        const buffer = fileSystem.readFileSync(svgPath);

        response.writeHead(200, {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400",
        });

        return response.end(buffer);
      }

      response.writeHead(204);

      return response.end();
    } catch {
      response.writeHead(204);

      return response.end();
    }
  }

  // *інкрементуємо лише «корисні» шляхи
  if (COUNTABLE.has(url)) requestsCount++;

  switch (url) {
    case "/":

    case "/orders":
      response.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.write("orders" + requestsCount);
      break;

    case "/items":
      response.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.write("items" + requestsCount);
      break;

    default:
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.write("404 not found" + requestsCount);
  }

  response.end();
});

server.listen(3007, () =>
  console.log("Server running on http://localhost:3007"),
);

// ! ПОЯСНЕННЯ
// ? Content-Type - у відповіді потрібен для того, щоб сказати браузеру чи клієнту, який саме формат даних ти йому відправляєш ( див. в network ).
// ? fs — File System module у Node.js - дозволяє працювати з файлами: читати, записувати, створювати папки, перевіряти існування тощо.
// ? buffer — це "сирі байти" файлу (наприклад, картинки або іконки), потім ми передаємо цей buffer прямо у res.end(buffer) і браузер отримує правильний файл.

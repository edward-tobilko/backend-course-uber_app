import { Request, Response } from "express";
import { log, error, warn } from "node:console";
import { createServer } from "node:http";

import { env } from "./config/env";
import { createApp } from "./app";
import { HTTP_CODES } from "./utils/http-codes";
import { normalizeDriverName } from "./utils/normalize";
import { dataBase } from "./db/drivers.db";
import { Driver, DriversName, DriverStatus } from "./types/drivers.types";

const app = createApp();
const server = createServer(app);

// ? method GET
app.get(
  ["/", "/drivers"],
  (req: Request<{}, {}, {}, { name: string }>, res: Response) => {
    let filteredDrivers = dataBase.drivers;

    // if (req.query.name) {
    //   filteredDrivers = filteredDrivers.filter((filteredDriver) =>
    //     filteredDriver.name.includes(req.query.name)
    //   );
    // }

    res.status(HTTP_CODES.OK_200).send(filteredDrivers);
  }
);

app.get(
  `/drivers/:driverId`,
  (req: Request<{ driverId: number }>, res: Response) => {
    // ищем водителя в бд по id
    const foundDriver = dataBase.drivers.find(
      (driver) => driver.driverId === +req.params.driverId
    );

    if (!foundDriver) {
      return res.sendStatus(HTTP_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_CODES.OK_200).json(foundDriver);
  }
);

// ? method POST
app.post(`/drivers`, (req: Request<{}>, res: Response) => {
  // const { name } = req.body ?? {}; // короткий і безпечний спосіб дістати name з тіла запиту, навіть якщо клієнт не передав body

  // if (!name) return res.sendStatus(HTTP_CODES.BAD_REQUEST_400);

  // if (typeof name !== "string" || name.trim().length === 0)
  //   return res
  //     .status(HTTP_CODES.BAD_REQUEST_400)
  //     .json({ message: "Invalid name. Name must be of type string!" });

  // проверяем приходящие данные на валидность и создаем нового водителя
  const newDriver: Driver = {
    driverId: dataBase.drivers.length
      ? dataBase.drivers[dataBase.drivers.length - 1].driverId + 1
      : 1,
    status: DriverStatus.Online,
    createdAt: new Date(),
    ...req.body,
  };

  // добавляем newDriver в БД
  dataBase.drivers.push(newDriver);

  log(newDriver); // див в термінал

  res.status(HTTP_CODES.CREATED_201).json(newDriver);
});

// ? method DELETE
app.delete("/testing/all-data", (req, res) => {
  dataBase.drivers = [];
  res.sendStatus(HTTP_CODES.NO_CONTENT_204);
});

// app.delete("/drivers/:id", (req: Request<{ id: number }>, res: Response) => {
//   // знаходимо індекс водія, якого ми хочемо видалити
//   for (let index = 0; index < dataBase.drivers.length; index++) {
//     let driver = dataBase.drivers[index];

//     if (driver.driverId === +req.params.id) {
//       // видаляємо один елемент
//       const [deletedDriver] = dataBase.drivers.splice(index, 1);

//       // повертаємо підтвердження
//       return res.status(HTTP_CODES.OK_200).json({
//         Message: `Driver id=${+req.params.id} deleted successfully`,
//         deleted: deletedDriver,
//       });
//     }
//   }

//   return res
//     .status(HTTP_CODES.NOT_FOUND_404)
//     .json({ message: `Driver with id=${+req.params.id} not found` });
// });

// // ? method UPDATE
// app.put(
//   "/drivers/:id",
//   (req: Request<{ id: number }, { name: string }>, res: Response) => {
//     const id = +req.params.id;

//     // знаходимо індекс водія, якого ми хочемо обновити
//     const index = dataBase.drivers.findIndex((index) => index.driverId === id);

//     // перевіряємо, якщо водія не знайдено
//     if (index === -1) {
//       return res
//         .status(HTTP_CODES.NOT_FOUND_404)
//         .json({ message: `Driver with id=${id} not found` });
//     }

//     // отримуємо нову строку
//     const raw = normalizeDriverName(req.body.name);

//     log(raw);

//     // перевіряємо на валідність нову строку
//     if (!raw)
//       return res
//         .status(HTTP_CODES.BAD_REQUEST_400)
//         .json({ message: "Name cannot be empty or spaces only" });

//     dataBase.drivers[index].name = raw as DriversName;

//     res.status(HTTP_CODES.OK_200).json({
//       message: `Driver id=${id} updated successfully`,
//       updatedDriver: dataBase.drivers[index],
//     });
//   }
// );

// app.patch(
//   "/drivers/:id",
//   (req: Request<{ id: number }, { name: string }>, res: Response) => {
//     const id = +req.params.id;

//     // знаходимо обʼєкт (водія), який ми будемо оновляти
//     const driver = dataBase.drivers.find((driver) => driver.driverId === id);

//     // перевіряємо, якщо обʼєкт не знайдено
//     if (!driver)
//       return res
//         .status(HTTP_CODES.NOT_FOUND_404)
//         .json({ message: `Driver with id=${id} not found` });

//     // отримуємо нову строку з валідацією
//     const raw = normalizeDriverName(req.body.name);

//     // перевіряємо на валідність нову строку
//     if (!raw)
//       return res
//         .status(HTTP_CODES.BAD_REQUEST_400)
//         .json({ message: "Name cannot be empty or spaces only" });

//     // оновлюємо лише те, що передали
//     driver.name = raw as DriversName;

//     res.status(HTTP_CODES.OK_200).json({
//       message: `Driver id=${id} updated successfully`,
//       updatedCourse: driver,
//     });
//   }
// );

server.listen(env.PORT, env.HOST, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

console.log("ENTRY:", __filename);

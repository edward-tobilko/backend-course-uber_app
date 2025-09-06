import { Request, Response } from "express";
import { log, error, warn } from "node:console";
import { createServer } from "node:http";

import { env } from "./config/env";
import { createApp } from "./app";
import { HTTP_CODES } from "./utils/http-codes";
import { normalizeCourseName } from "./utils/normalize";
import { dataBase } from "./db/courses.db";
import { Course, CourseName } from "./types/course.types";

const app = createApp();
const server = createServer(app);

// ? method GET
app.get(
  ["/", "/courses"],
  (req: Request<{}, {}, {}, { name: string }>, res: Response) => {
    let filteredCourses = dataBase.courses;

    if (req.query.name) {
      filteredCourses = filteredCourses.filter((filteredCourse) =>
        filteredCourse.name.includes(req.query.name)
      );
    }

    res.status(HTTP_CODES.OK_200).send(filteredCourses);
  }
);

app.get(
  `/courses/:courseId`,
  (req: Request<{ courseId: number }>, res: Response) => {
    const foundCourse = dataBase.courses.find(
      (course) => course.courseId === +req.params.courseId
    );

    if (!foundCourse) {
      return res.sendStatus(HTTP_CODES.NOT_FOUND_404);
    }

    res.status(HTTP_CODES.OK_200).json(foundCourse);
  }
);

// ? method POST
app.post(`/courses`, (req: Request<{ name: string }>, res: Response) => {
  const { name } = req.body ?? {}; // короткий і безпечний спосіб дістати name з тіла запиту, навіть якщо клієнт не передав body

  if (!name) return res.sendStatus(HTTP_CODES.BAD_REQUEST_400);

  if (typeof name !== "string" || name.trim().length === 0)
    return res
      .status(HTTP_CODES.BAD_REQUEST_400)
      .json({ message: "Invalid name. Name must be of type string!" });

  const newCourse: Course = {
    courseId: +new Date(),
    name: req.body.name,
  };

  dataBase.courses.push(newCourse);

  log(newCourse); // див в термінал

  res.status(HTTP_CODES.CREATED_201).json(newCourse);
});

// ? method DELETE
app.delete("/courses/:id", (req: Request<{ id: number }>, res: Response) => {
  // знаходимо індекс курсу, якого ми хочемо видалити
  for (let index = 0; index < dataBase.courses.length; index++) {
    let course = dataBase.courses[index];

    if (course.courseId === +req.params.id) {
      // видаляємо один елемент
      const [deletedCourse] = dataBase.courses.splice(index, 1);

      // повертаємо підтвердження
      return res.status(HTTP_CODES.OK_200).json({
        Message: `Course id=${+req.params.id} deleted successfully`,
        deleted: deletedCourse,
      });
    }
  }

  return res
    .status(HTTP_CODES.NOT_FOUND_404)
    .json({ message: `Course with id=${+req.params.id} not found` });
});

// ? method UPDATE
app.put(
  "/courses/:id",
  (req: Request<{ id: number }, { name: string }>, res: Response) => {
    const id = +req.params.id;

    // знаходимо індекс курсу, якого ми хочемо обновити
    const index = dataBase.courses.findIndex((index) => index.courseId === id);

    // перевіряємо, якщо курс не знайдено
    if (index === -1) {
      return res
        .status(HTTP_CODES.NOT_FOUND_404)
        .json({ message: `Course with id=${id} not found` });
    }

    // отримуємо нову строку
    const raw = normalizeCourseName(req.body.name);

    log(raw);

    // перевіряємо на валідність нову строку
    if (!raw)
      return res
        .status(HTTP_CODES.BAD_REQUEST_400)
        .json({ message: "Name cannot be empty or spaces only" });

    dataBase.courses[index].name = raw as CourseName;

    res.status(HTTP_CODES.OK_200).json({
      message: `Course id=${id} updated successfully`,
      updatedCourse: dataBase.courses[index],
    });
  }
);

app.patch(
  "/courses/:id",
  (req: Request<{ id: number }, { name: string }>, res: Response) => {
    const id = +req.params.id;

    // знаходимо обʼєкт (курс), який ми будемо оновляти
    const course = dataBase.courses.find((course) => course.courseId === id);

    log(course);

    // перевіряємо, якщо обʼєкт не знайдено
    if (!course)
      return res
        .status(HTTP_CODES.NOT_FOUND_404)
        .json({ message: `Course with id=${id} not found` });

    // отримуємо нову строку
    const raw = normalizeCourseName(req.body.name);

    // перевіряємо на валідність нову строку
    if (!raw)
      return res
        .status(HTTP_CODES.BAD_REQUEST_400)
        .json({ message: "Name cannot be empty or spaces only" });

    // оновлюємо лише те, що передали
    course.name = raw as CourseName;

    res.status(HTTP_CODES.OK_200).json({
      message: `Course id=${id} updated successfully`,
      updatedCourse: course,
    });
  }
);

server.listen(env.PORT, env.HOST, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

console.log("ENTRY:", __filename);

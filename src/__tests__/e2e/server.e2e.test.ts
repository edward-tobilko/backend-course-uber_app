import { createApp } from "@/src/app";
import request from "supertest";

const app = createApp();

describe("E2E: courses API", () => {
  test("GET '/' and '/courses' -> status code 200 and array of courses", async () => {
    await request(app).get("/");
  });
});

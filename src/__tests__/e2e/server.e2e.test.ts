import { createApp } from "@/src/app";
import request from "supertest";

const app = createApp();

describe("E2E: drivers API", () => {
  it("GET '/' and '/drivers' -> status code 200 and array of drivers", async () => {
    await request(app).get("/");
  });
});

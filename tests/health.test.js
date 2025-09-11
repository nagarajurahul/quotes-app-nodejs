const request = require("supertest");
const app = require("../src/app");

describe("Health Check API", () => {
  it("should return UP status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("UP");
  });
});

describe("Hello API", () => {
  it("should return Hello World", async () => {
    const res = await request(app).get("/hello");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello World From Quotes App!");
  });
});

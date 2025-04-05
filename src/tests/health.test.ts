import { describe, it, expect } from "vitest";
import { app } from "../index.js";

describe("Health Check", () => {
  it("should return 200 OK", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "OK" });
  });
});

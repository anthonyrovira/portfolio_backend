import { describe, it, expect } from "vitest";
import { app } from "../index.js";
import { env } from "../core/config/env.js";

describe("Messages API", () => {
  it("should get all messages successfully", async () => {
    const res = await app.request("/messages", {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json", "X-Internal-Secret": env.API_INTERNAL }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const firstMessage = data[0];
      expect(firstMessage).toHaveProperty("id");
      expect(firstMessage).toHaveProperty("name");
      expect(firstMessage).toHaveProperty("email");
      expect(firstMessage).toHaveProperty("message");
    }
  });

  it("shouldn't get all messages successfully", async () => {
    const res = await app.request("/messages", {
      method: "GET",
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    expect(res.status).toBe(403);
  });
});

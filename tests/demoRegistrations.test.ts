import { describe, it, expect } from "vitest";
import { getDemoRegisteredUsersFromCookieHeader } from "../lib/demoRegistrations";

describe("demo registrations cookie parsing", () => {
  it("returns an empty list when the cookie is missing", () => {
    expect(getDemoRegisteredUsersFromCookieHeader(null)).toEqual([]);
  });

  it("parses registered users from the demo cookie", () => {
    const payload = Buffer.from(
      JSON.stringify({
        users: [
          {
            id: "demo-reg-123",
            email: "newfounder@example.com",
            name: "New Founder",
            role: "ENTREPRENEUR",
            passwordHash: "$2b$12$abcdefghijklmnopqrstuv",
          },
        ],
      }),
      "utf8",
    ).toString("base64url");

    const users = getDemoRegisteredUsersFromCookieHeader(
      `foo=bar; bhaf-demo-registrations=${payload}; theme=light`,
    );

    expect(users).toHaveLength(1);
    expect(users[0]?.email).toBe("newfounder@example.com");
    expect(users[0]?.role).toBe("ENTREPRENEUR");
  });
});

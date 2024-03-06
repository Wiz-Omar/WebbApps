import request from "supertest";
import { app } from "../../src/start"; // Adjust the import path to your Express app

describe("User Authentication", () => {
  it("should log in a user with valid credentials", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User successfully logged in");
    // Add additional assertions if needed
  });

  it("should handle invalid credentials", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({ username: "testuser", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid username or password");
    // Add additional assertions if needed
  });

  // Add more test cases for different scenarios
});

import { app } from "../../src/start"; // Adjust the import path to your Express app

import { SuperTest, Test } from "supertest";

const session = require("supertest-session");

let authenticatedSession: SuperTest<Test>;
let unauthenticatedSession: SuperTest<Test>;

describe("User Authentication, End-to-End", () => {
  let testUser = { username: "testuser", password: "testpass" };

  // Create a user before all tests
  beforeAll(async () => {
    unauthenticatedSession = session(app);
    authenticatedSession = session(app);
    await authenticatedSession
      .post("/user")
      .send(testUser);
  });

  // Delete the user after all tests
  afterAll(async () => {
    const reponse = await authenticatedSession.delete(`/user/delete`);
    console.log(reponse.status);
  });

  // Tests go here

  // Happy path - Login
  it("should log in a user with valid credentials", async () => {
    const response = await authenticatedSession
      .post("/user/login")
      .send(testUser);
    expect(response.status).toBe(200);
  });

  // Failure - Login, invalid credentials
  it("should handle login with invalid (incorrect) credentials", async () => {
    const response = await authenticatedSession
      .post("/user/login")
      .send({ username: testUser.username, password: "wrongpassword" });
    expect(response.status).toBe(401);
  });

  // Failure - Register, invalid input data
  it("should handle register with invalid input password", async () => {
    const response = await authenticatedSession
      .post("/user")
      .send({ username: "", password: "short" });
    expect(response.status).toBe(400);
  });

  it("should handle register with invalid input data for username", async () => {
    const response = await authenticatedSession
      .post("/user")
      .send({ username$: "", password: "muchlongerpassword" });
    expect(response.status).toBe(400);
  });

  // Duplicate Username Registration
it("should reject registration with a duplicate username", async () => {
  // Attempt to register a user with the same credentials as the test user
  const response = await authenticatedSession
    .post("/user")
    .send(testUser);
  // Expect a 409 Conflict response due to duplicate username
  expect(response.status).toBe(409);
});

// Invalid Input for Registration - Special Characters in Username
it("should reject registration with invalid username characters", async () => {
  const response = await authenticatedSession
    .post("/user")
    .send({ username: "invalid$user!", password: "validPassword123" });
  // Adjust the expected status code and message based on your actual validation logic
  expect(response.status).toBe(400);
});

// User Deletion without Login
it("should not allow user deletion without being logged in", async () => {
  // Directly attempt to delete a user without setting up a session
  const response = await unauthenticatedSession
    .delete(`/user/delete`) // Ensure the endpoint matches your actual API
    .send();

  // Expect a 401 Unauthorized response
  expect(response.status).toBe(401);
});

});

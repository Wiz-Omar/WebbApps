import request from "supertest";
import { app } from "../../src/start"; // Adjust the import path to your Express app
import path from "path";

import { SuperTest, Test } from "supertest";

const session = require("supertest-session");

let authenticatedSession: SuperTest<Test>;
let unauthenticatedSession: SuperTest<Test>;

//TODO: add code for creating a new user that is then deleted after the tests are run!
beforeAll(async () => {
  // Create a session for an authenticated user
  authenticatedSession = session(app);
  await authenticatedSession
    .post("/user/login")
    .send({ username: "username", password: "Testpassword1!" });

  // Create a session for an unauthenticated user
  unauthenticatedSession = session(app);
  // No login action for unauthenticatedSession to simulate a logged-out state
});

afterAll(async () => {
  // Cleanup
  //await authenticatedSession.post("/user/logout");
  //await authenticatedSession.post("/user/logout");
});

describe("Like an image, End-to-End", () => {
    // Happy path
    it("should be able to like an image", async () => {
      const response = await authenticatedSession.post("/like/123");
      expect(response.status).toBe(200);
      expect(response.text).toBe("Image liked successfully");
    });

    // Failure scenario #1 - Image not found
    it("should return 404 if the image does not exist", async () => {
      const response = await authenticatedSession.post("/like/123");
      expect(response.status).toBe(404);
      expect(response.text).toBe("The requested image could not be found.");
    });

    // Failure scenario #2 - Image already liked
    it("should return 409 if the image has already been liked", async () => {
      const response = await authenticatedSession.post("/like/123");
      expect(response.status).toBe(409);
      expect(response.text).toBe("This image has already been liked by the user.");
    });

    // Failure scenario #3 - Unauthorized
    it("should return 401 if the user is not logged in", async () => {
      const response = await unauthenticatedSession.post("/like/123");
      expect(response.status).toBe(401);
      expect(response.text).toBe("Unauthorized action. User not logged in");
    });
});
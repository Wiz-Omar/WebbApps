// tests/imageRouter.test.ts
import request from "supertest";
import { Express } from "express"; // Importing Express type for app
import { app } from "../../src/start"; // Adjust the import path to your Express app

const superTestRequest = request(app);

let userToken: string;

// A `beforeAll` hook to sign up and log in before running the tests
beforeAll(async () => {
  // Assuming there is a user with username "testuser" and password "testpass" in the database
  const response = await request(app)
    .post("/user/login/")
    .send({ username: "testuser", password: "testpass" });

  userToken = response.body.token; // Assign the token from the login response to userToken
  console.log("userToken is !!!!!!!!!!!!!!!!!!!!!: ", userToken);
});

/* describe("Upload an image, End-to-End", () => {
  // Happy Path
  it("should allow a user to upload an image", async () => {
    const response = await request(app)
      .post("/images/") // Adjust the endpoint as necessary
      .set("Authorization", `Bearer ${userToken}`)
      .attach("file", "path/to/test/image.png"); // Use the correct form field and file path

    expect(response.statusCode).toBe(201);
  });

  // Failure Scenario
  it("should reject an upload with invalid file type", async () => {
    const response = await request(app)
      .post("/images")
      .set("Authorization", `Bearer ${userToken}`)
      .attach("file", "path/to/test/invalid-file.txt");

    expect(response.statusCode).toBe(415); // Assuming 415 for Unsupported Media Type
  });
});

describe("Get all images, End-to-End", () => {
  // Happy Path
  it("should allow a user to view their images", async () => {
    const response = await request(app)
      .get("/images") // Adjust the endpoint as necessary
      .set("Authorization", `Bearer ${userToken}`); // Use proper authentication

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Failure Scenario
  it("should not allow unauthenticated users to view images", async () => {
    const response = await request(app).get("/images");
    expect(response.statusCode).toBe(401); // Assuming 401 for Unauthorized
  });
}); */

//TODO: should be in likeRouter.test.ts
/* describe("Like an image, End-to-End", () => {
  // Happy Path
  it("should allow a user to view their liked images", async () => {
    const response = await request(app)
      .get("/user/images/liked") // Adjust the endpoint as necessary
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Failure Scenario
  it("should not allow unauthenticated users to view liked images", async () => {
    const response = await request(app).get("/user/images/liked");

    expect(response.statusCode).toBe(401);
  });
}); */

/* describe("Delete an image, End-to-End", () => {
  // Happy Path
  it("should allow a user to delete their image", async () => {
    // Get an imageId from the user's images
    const userImagesResponse = await request(app)
      .get("/images")
      .set("Authorization", `Bearer ${userToken}`);
    const imageId = userImagesResponse.body[0].id; // Assuming the first image is the one to be deleted
    const response = await request(app)
      .delete(`/images/${imageId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
  });
});
 */

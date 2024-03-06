import request from "supertest";
import { app } from "../../src/start"; // Adjust the import path to your Express app
import path from "path";

import { SuperTest, Test } from "supertest";

const session = require("supertest-session");

let authenticatedSession: SuperTest<Test>;
let unauthenticatedSession: SuperTest<Test>;

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

// Clean up the database after each test, remove any uploaded images
afterEach(async () => {
  // Clean up the database
  const response = await authenticatedSession.get("/image");
  const images = response.body;
  for (const image of images) {
    await authenticatedSession.delete(`/image/${image.id}`);
  }
});

describe("Upload an image, End-to-End", () => {
  // Happy Path
  it("should allow a user to upload an image", async () => {
    // Construct an absolute path to the test image
    const imagePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testImage.png"
    );

    const response = await authenticatedSession
      .post("/image")
      .attach("file", imagePath);

    expect(response.status).toBe(201);
  });

  // Failure Scenario #1 - Incorrect filetype uploaded
  it("should reject an upload with invalid file type", async () => {
    // Construct an absolute path to the test file
    const filePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testFile.txt"
    );
    const response = await authenticatedSession
      .post("/image")
      .attach("file", filePath);
    expect(response.status).toBe(415);
  });

  // Failure Scenario #2 - File size exceeds limit
  it("should reject an upload with file size exceeding 10MB", async () => {
    // Construct an absolute path to the test file
    const filePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testLargeImage.jpg"
    );
    const response = await authenticatedSession
      .post("/image")
      .attach("file", filePath);
    expect(response.status).toBe(413);
  });

  // Failure Scenario #3 - No file uploaded
  it("should reject an upload with no file", async () => {
    const response = await authenticatedSession.post("/image");
    expect(response.status).toBe(400);
  });
});

describe("Get all images, End-to-End", () => {
  // Happy Path
  it("should allow a user to view their images", async () => {
    const response = await authenticatedSession
      .get("/image") // Adjust the endpoint as necessary
      //.set("Authorization", `Bearer ${"testuser"}`)
      .redirects(1); // Automatically follow redirects

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Happy Path #2 - Sort by filename, ascending
  it("should allow a user to view their images sorted by filename", async () => {
    const response = await authenticatedSession
      .get("/image?sortField=filename&sortOrder=asc")
      .redirects(1); // Automatically follow redirects

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // Check if the images are sorted by filename in ascending order
    const images = response.body;
    for (let i = 0; i < images.length - 1; i++) {
      expect(images[i].filename <= images[i + 1].filename).toBeTruthy();
    }
  });

  // Happy Path #3 - Filter by onlyLiked
  it("should allow a user to view their liked images", async () => {
    // Like an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach("file", path.resolve(__dirname, "..", "..", "test", "testImage.png"));
    // 
    await authenticatedSession.post(`/like/${imageId}`);
    const response = await authenticatedSession
      .get("/image?onlyLiked=true")
      .redirects(1); // Automatically follow redirects

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Failure Scenario #1 - Unauthenticated user
  it("should not allow unauthenticated users to view images", async () => {
    const response = await unauthenticatedSession.get("/image").redirects(1); // Automatically follow redirects
    expect(response.status).toBe(401); // Assuming 401 for Unauthorized
  });

  // Failure Scenario #2 - Invalid sortField and sortOrder
  it("should reject invalid sortField and sortOrder", async () => {
    const response = await authenticatedSession
      .get("/image?sortField=invalid&sortOrder=invalid")
      .redirects(1); // Automatically follow redirects
    expect(response.status).toBe(400); // Adjusted status code expectation based on actual API validation
  });
});

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

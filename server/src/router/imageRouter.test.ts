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

  // Create a user
  await authenticatedSession
    .post("/user")
    .send({ username: "username", password: "Testpassword1!" });

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
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    await authenticatedSession.delete(`/image/${image.id}`);
    // remove the like from the image (if it exists)
    await authenticatedSession.delete(`/like/${image.id}`);
  }
});

afterAll(async () => {
  // Remove the user
  await authenticatedSession.delete(`/user/delete`);
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

  // Failure Scenario #4 - Should not be able to upload the same image twice
  it("should reject an upload with the same image", async () => {
    // Construct an absolute path to the test image
    const imagePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testImage.png"
    );

    // Upload the image
    const response = await authenticatedSession
      .post("/image")
      .attach("file", imagePath);
    expect(response.status).toBe(201);

    // Attempt to upload the same image again
    const response2 = await authenticatedSession
      .post("/image")
      .attach("file", imagePath);
    expect(response2.status).toBe(409);
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
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "testImage.png")
      );
    // Get all images
    const images = await authenticatedSession.get("/image").redirects(1);
    // Get an imageId from one of the images
    const imageId = images.body[0].id;
    // Like the image
    await authenticatedSession.post(`/like/${imageId}`);
    // Get only liked images
    const response = await authenticatedSession
      .get("/image?onlyLiked=true")
      .redirects(1); // Automatically follow redirects

    // Check that the filename is the same as the image that was uploaded
    expect(response.body[0].filename).toBe("testImage.png");
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

describe("Delete an image, End-to-End", () => {
  // Happy Path
  it("should allow a user to delete their image", async () => {
    // Upload an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "testImage.png")
      );

    // Get an imageId from the user's images
    const userImagesResponse = await authenticatedSession
      .get("/image")
      .redirects(1); // Automatically follow redirects
    const imageId = userImagesResponse.body[0].id; // Assuming the first image is the one to be deleted

    // Delete the image
    const response = await authenticatedSession
      .delete(`/image/${imageId}`)
      .redirects(1); // Automatically follow redirects

    expect(response.status).toBe(200);
  });

  // Failure Scenario #1 - Unauthenticated user
  it("should not allow unauthenticated users to delete images", async () => {
    const response = await unauthenticatedSession
      .delete("/image/123")
      .redirects(1); // Automatically follow redirects
    expect(response.status).toBe(401); // Assuming 401 for Unauthorized
  });

  // Failure Scenario #2 - Invalid imageId
  it("should reject invalid (non-existent) imageId", async () => {
    const response = await authenticatedSession
      .delete("/image/invalid")
      .redirects(1); // Automatically follow redirects
    expect(response.status).toBe(500); // 500 - because the error is that no image could be found (internal server error)
  });

  // Failure Scenario #3 - No imageId provided
  it("should reject delete with no imageId provided", async () => {
    const response = await authenticatedSession.delete("/image").redirects(1); // Automatically follow redirects
    expect(response.status).toBe(404); // 404 - because the route is not found
  });

});

describe("Search for an image, End-to-End", () => {
  // Happy Path
  it("should allow a user to search for an image", async () => {
    // Upload an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "testImage.png")
      );

    // Search for the image
    const response = await authenticatedSession
      .get("/image/search?search=test")
      .redirects(1); // Automatically follow redirects

    // Check that the image(s) returned have the search term in the filename, by looping through the array of images
    // and checking if the filename includes the search term
    for (let i = 0; i < response.body.length; i++) {
      const image = response.body[i];
      expect(image.filename).toContain("test");
    }
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Happy Path #2 - Search should be case insensitive
  it("should allow a user to search for an image with a case-insensitive search term", async () => {
    // Upload an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "testImage.png")
      );

    // Search for the image
    const response = await authenticatedSession
      .get("/image/search?search=TEST")
      .redirects(1); // Automatically follow redirects

    // Check that the image(s) returned have the search term in the filename, by looping through the array of images
    // and checking if the filename includes the search term
    for (let i = 0; i < response.body.length; i++) {
      const image = response.body[i];
      expect(image.filename).toContain("test");
    }
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Happy Path #3 - Search should handle special characters
  it("should allow a user to search for an image with special characters", async () => {
    // Upload an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "!specialCaseImage.jpg")
      );

    // Search for the image
    const response = await authenticatedSession
      .get("/image/search?search=!special")
      .redirects(1); // Automatically follow redirects

    // Check that the image(s) returned have the search term in the filename, by looping through the array of images
    // and checking if the filename includes the search term
    for (let i = 0; i < response.body.length; i++) {
      const image = response.body[i];
      expect(image.filename).toContain("!");
    }
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Failure Scenario #1 - Unauthenticated user
  it("should not allow unauthenticated users to search for images", async () => {
    const response = await unauthenticatedSession
      .get("/image/search?search=test")
      .redirects(1); // Automatically follow redirects
    expect(response.status).toBe(401); // Assuming 401 for Unauthorized
  });

  // Failure Scenario #2 - No search query provided
  it("should reject search with no query provided", async () => {
    const response = await authenticatedSession
      .get("/image/search")
      .redirects(1); // Automatically follow redirects
    expect(response.status).toBe(400); // Assuming 400 for Bad Request
  });
});

describe("Rename an image, End-to-End", () => {
  // Happy Path
  it("should allow a user to rename an image", async () => {
    // Upload an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "testImage.png")
      );

    // Get an imageId from the user's images
    const userImagesResponse = await authenticatedSession
      .get("/image")
      .redirects(1); // Automatically follow redirects
    const imageId = userImagesResponse.body[0].id; // Assuming the first image is the one to be renamed

    // Rename the image
    const response = await authenticatedSession
      .patch(`/image/${imageId}`)
      .send({ newFilename: "newFilename" })
      .redirects(1); // Automatically follow redirects

    expect(response.status).toBe(200);
  });

  // Failure Scenario #1 - Unauthenticated user
  it("should not allow unauthenticated users to rename images", async () => {
    const response = await unauthenticatedSession
      .patch("/image/123")
      .send({ newFilename: "newFilename" })
      .redirects(1); // Automatically follow redirects
    expect(response.status).toBe(401); // Assuming 401 for Unauthorized
  });

  // Failure Scenario #2 - Non-existent imageId provided
  it("should reject non-existent imageId", async () => {
    const response = await authenticatedSession
      .patch("/image/123")
      .send({ newFilename: "newFilename" })
      .redirects(1); // Automatically follow redirects
    expect(response.status).toBe(500); // 500 - because the error is that no image could be found (internal server error)
  });

  // Failure Scenario #3 - No newFilename provided
  it("should reject rename if no newFilename provided", async () => {
    // Upload an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "testImage.png")
      );

    // Get an imageId from the user's images
    const userImagesResponse = await authenticatedSession
      .get("/image")
      .redirects(1); // Automatically follow redirects
    const imageId = userImagesResponse.body[0].id; // Assuming the first image is the one to be renamed

    // Rename the image
    const response = await authenticatedSession
      .patch(`/image/${imageId}`)
      .redirects(1); // Automatically follow redirects

    expect(response.status).toBe(400);
  });

  // Failure Scenario #4 - No newFilename provided
  it("should reject rename if newFilename is too long", async () => {
    // Upload an image first
    const uploadResponse = await authenticatedSession
      .post("/image")
      .attach(
        "file",
        path.resolve(__dirname, "..", "..", "test", "testImage.png")
      );

    // Get the imageId from the uploaded image
    const imageId = uploadResponse.body.id;

    const longFilename = "a".repeat(257);
    // Rename the image
    const response = await authenticatedSession
      .patch(`/image/${imageId}`)
      .send({ newFilename: longFilename })
      .redirects(1); // Automatically follow redirects

    expect(response.status).toBe(400);
  });
});

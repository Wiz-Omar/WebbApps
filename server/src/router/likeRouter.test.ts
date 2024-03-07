import request from "supertest";
import { app } from "../../src/start"; // Adjust the import path to your Express app
import path from "path";

import { SuperTest, Test } from "supertest";

const session = require("supertest-session");

let authenticatedSession: SuperTest<Test>;
let unauthenticatedSession: SuperTest<Test>;

const INVALID_IMAGE_ID = "invalid_id";
const VALID_IMAGE_ID = "507f1f77bcf85cd799439111"; // Example MongoDB ObjectId (BSON)

//TODO: add code for creating a new user that is then deleted after the tests are run!
beforeAll(async () => {
  // Create a session for an authenticated user
  authenticatedSession = session(app);

  // Create a user
  await authenticatedSession
    .post("/user")
    .send({ username: "username", password: "Testpassword1!" });
  
  // Login the user
  await authenticatedSession
    .post("/user/login")
    .send({ username: "username", password: "Testpassword1!" });

  // Create a session for an unauthenticated user
  unauthenticatedSession = session(app);
  // No login action for unauthenticatedSession to simulate a logged-out state
});

afterEach(async () => {
  // Clean up the database
  const response = await authenticatedSession.get("/image");
  const images = response.body;
  for (const image of images) {
    await authenticatedSession.delete(`/image/${image.id}`);
    // remove the like from the image (if it exists)
    await authenticatedSession.delete(`/like/${image.id}`);
  }
});

afterAll(async () => {
  // Remove the user
  await authenticatedSession.delete(`/user/delete`);
});

afterAll(async () => {
  console.log("Closing the server...");
});

describe("Like an image, End-to-End", () => {
  // Happy path - like an image
  it("should be able to like an image", async () => {
    // Construct an absolute path to the test image
    const imagePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testImage.png"
    );
    // Upload the image
    const image = await authenticatedSession
      .post("/image")
      .attach("file", imagePath);
    // Fetch the image to check if it has been liked
    const response = await authenticatedSession.get("/image");
    const images = response.body;
    // Like the image
    const likeResponse = await authenticatedSession.post(
      "/like/" + images[0].id
    );
    // Check if the image has been liked
    const likedResponse = await authenticatedSession.get(
      "/like/" + images[0].id
    );
    expect(likeResponse.status).toBe(200);
    expect(likedResponse.body.liked).toBe(true);

    // Check that the image has been liked
    //TODO: make own test for GET /like
    const checkLikedResponse = await authenticatedSession.get(
      "/like/" + images[0].id
    );
    expect(checkLikedResponse.status).toBe(200);
  });

  // Failure scenario #1 - Image not found
  it("should return 404 if the image does not exist", async () => {
    const response = await authenticatedSession.post(`/like/${VALID_IMAGE_ID}`);
    expect(response.status).toBe(404);
  });

  // Failure scenario #2 - ImageID is invalid
  it("should return 400 if the image ID is invalid", async () => {
    const response = await authenticatedSession.post(
      `/like/${INVALID_IMAGE_ID}`
    );
    expect(response.status).toBe(400);
  });

  // Failure scenario #3 - Image already liked
  it("should return 409 if the image has already been liked", async () => {
    // Resolve the path to the test image
    const imagePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testImage.png"
    );

    // Upload the test image
    await authenticatedSession.post("/image").attach("file", imagePath);

    // Fetch the list of images to get the ID of the recently uploaded image
    const imagesResponse = await authenticatedSession.get("/image");
    expect(imagesResponse.status).toBe(200); // Check that fetching images is successful
    const images = imagesResponse.body;
    const uploadedImageId = images[0].id; // Assuming the most recently uploaded image is at the top

    // Like the uploaded image for the first time
    const firstLikeResponse = await authenticatedSession.post(
      `/like/${uploadedImageId}`
    );
    expect(firstLikeResponse.status).toBe(200); // Check that the first like is successful

    // Attempt to like the same image again
    const secondLikeResponse = await authenticatedSession.post(
      `/like/${uploadedImageId}`
    );
    expect(secondLikeResponse.status).toBe(409);
  });

  // Failure scenario #3 - Unauthorized
  it("should return 401 if the user is not logged in", async () => {
    const response = await unauthenticatedSession.post("/like/123");
    expect(response.status).toBe(401);
  });
});


describe("Unlike an image, End-to-End", () => {
  // Happy path - unlike an image
  it("should be able to unlike an image", async () => {
    // Construct an absolute path to the test image
    const imagePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testImage.png"
    );
    // Upload the image
    const image = await authenticatedSession
      .post("/image")
      .attach("file", imagePath);
    // Fetch the image to check if it has been liked
    const response = await authenticatedSession.get("/image");
    const images = response.body;
    // Like the image
    const likeResponse = await authenticatedSession.post(
      "/like/" + images[0].id
    );
    // Unlike the image
    const unlikeResponse = await authenticatedSession.delete(
      "/like/" + images[0].id
    );
    // Check if the image has been unliked
    const likedResponse = await authenticatedSession.get(
      "/like/" + images[0].id
    );
    expect(unlikeResponse.status).toBe(200);
    expect(likedResponse.body.liked).toBe(false);
  });

  // Failure scenario #1 - Image not found
  it("should return 404 if the image does not exist", async () => {
    const response = await authenticatedSession.delete(`/like/${VALID_IMAGE_ID}`);
    expect(response.status).toBe(404);
  });

  // Failure scenario #2 - ImageID is invalid
  it("should return 400 if the image ID is invalid", async () => {
    const response = await authenticatedSession.delete(
      `/like/${INVALID_IMAGE_ID}`
    );
    expect(response.status).toBe(400);
  });

  // Failure scenario #3 - Unauthorized
  it("should return 401 if the user is not logged in", async () => {
    const response = await unauthenticatedSession.delete("/like/123");
    expect(response.status).toBe(401);
  });
});

describe("Check if image is liked, End-to-End", () => {
  // Happy path - check if an image is liked
  it("should be able to check if an image is liked", async () => {
    // Construct an absolute path to the test image
    const imagePath = path.resolve(
      __dirname,
      "..",
      "..",
      "test",
      "testImage.png"
    );
    // Upload the image
    const image = await authenticatedSession
      .post("/image")
      .attach("file", imagePath);
    // Fetch the image to check if it has been liked
    const response = await authenticatedSession.get("/image");
    const images = response.body;
    // Check if the image has been liked
    const likedResponse = await authenticatedSession.get(
      "/like/" + images[0].id
    );
    expect(likedResponse.status).toBe(200);
    expect(likedResponse.body.liked).toBe(false);
  });

  // Failure scenario #1 - Image not found
  it("should return 404 if the image does not exist", async () => {
    const response = await authenticatedSession.get(`/like/${VALID_IMAGE_ID}`);
    expect(response.status).toBe(404);
  });

  // Failure scenario #2 - ImageID is invalid
  it("should return 400 if the image ID is invalid", async () => {
    const response = await authenticatedSession.get(
      `/like/${INVALID_IMAGE_ID}`
    );
    expect(response.status).toBe(400);
  });

  // Failure scenario #3 - Unauthorized
  it("should return 401 if the user is not logged in", async () => {
    const response = await unauthenticatedSession.get("/like/123");
    expect(response.status).toBe(401);
  });
});
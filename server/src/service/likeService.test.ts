// likeService.test.ts
import { LikeService } from "./likeService";

test("If an image is liked, it should be in the liked images list", async () => {
  const imageId = "1"; // Assuming image ID is a string
  const likeService = new LikeService();
  await likeService.likeImage(imageId);
  const likedImages = await likeService.getLikedImages();
  expect(likedImages).toContain(imageId);
});

test("If an image is unliked, it should not be in the liked images list", async () => {
  const imageId = "1"; // Assuming image ID is a string
  const likeService = new LikeService();
  await likeService.likeImage(imageId);
  await likeService.unlikeImage(imageId);
  const likedImages = await likeService.getLikedImages();
  expect(likedImages).not.toContain(imageId);
});

import * as SuperTest from "supertest";
import { app } from "../../src/start";

const request = SuperTest.default(app);

// End-to-end test
test("End-to-end test", async () => {
  const likeService = new LikeService();
  const imageId = "1"; // Assuming image ID is a string

  // Like an image via the router
  await request.post(`/like/${imageId}`).expect(200);

  // Get liked images via the router
  const likedImages = await request.get("/like").expect(200);
  expect(likedImages.body).toContain(imageId);

  // Unlike the image via the router
  await request.delete(`/like/${imageId}`).expect(200);

  // Get liked images again via the service
  const updatedLikedImages = await likeService.getLikedImages();
  expect(updatedLikedImages).not.toContain(imageId);
});

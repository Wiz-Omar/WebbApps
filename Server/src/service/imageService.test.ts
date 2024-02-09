// imageService.test.ts
import { ImageService } from "./imageService";

// Testing deletion of an image
test("If an image is deleted from the list then it should not be in the list", async () => {
  const id = 1;
  const imageService = new ImageService();
  await imageService.deleteImage(id);
  const images = await imageService.getImages();
  expect(images.some((image) => image.id === id)).toBeFalsy();
});

// Testing addition of an image
test("If an image is added to the list then it should be in the list", async () => {
  const filename = "test.png";
  const url = "http://example.com/test.jpg";
  const imageService = new ImageService();
  await imageService.addImage(filename, url);
  const images = await imageService.getImages();
  expect(
    images.some((image) => image.filename === filename && image.url === url)
  ).toBeTruthy();
});

// Testing sorting of images, filename ascending
test("Images should be sorted by filename in ascending order", async () => {
  const imageService = new ImageService();
  // Use enums for sortField and sortOrder
  const images = await imageService.getImages("filename", "asc");
  const filenames = images.map((image) => image.filename);
  const sortedFilenames = [...filenames].sort((a, b) => a.localeCompare(b)); // Explicit sorting for clarity
  expect(filenames).toEqual(sortedFilenames);
});

// Testing sorting of images, filename descending
test("Images should be sorted by filename in descending order", async () => {
  const imageService = new ImageService();
  // Use enums for sortField and sortOrder
  const images = await imageService.getImages("filename", "desc");
  const filenames = images.map((image) => image.filename);
  const sortedFilenames = [...filenames].sort((a, b) => b.localeCompare(a)); // Sort and then reverse for descending
  expect(filenames).toEqual(sortedFilenames);
});

// Testing sorting with bad sortingField
test("If an invalid sort field is provided then an error should be thrown", async () => {
  const imageService = new ImageService();
  // Use enums for sortField and sortOrder
  await expect(imageService.getImages("badField", "asc")).rejects.toThrow();
});

// Testing sorting with bad sortingOrder
test("If an invalid sort order is provided then an error should be thrown", async () => {
  const imageService = new ImageService();
  // Use enums for sortField and sortOrder
  await expect(
    imageService.getImages("filename", "badOrder")
  ).rejects.toThrow();
});

// imageRouter.test.ts
import * as SuperTest from "supertest";
import { app } from "../../src/start";
import { Image } from "../model/image";

const request = SuperTest.default(app);

test("End-to-end test", async () => {
  // upload an image
  const res0 = await request
    .post("/image")
    .send({ filename: "test.png", url: "http://example.com/test.jpg" });
  expect(res0.statusCode).toEqual(201);

  // get all images
  const res1 = await request.get("/image");
  // should be 200 OK
  expect(res1.statusCode).toEqual(200);

  // should contain the uploaded image
  const images = res1.body;
  expect(images.map((image: Image) => image.filename)).toContain("test.png");

  // ensure that the images are sorted by filename, ascending
  const filenames_1 = images.map((image: Image) => image.filename);
  // Clone `filenames_1` and sort the clone
  const sortedFilenames = [...filenames_1].sort();
  // Compare the original array to the sorted clone to ensure it was already sorted
  expect(filenames_1).toEqual(sortedFilenames);

  // make a new request with images sorted by upload date, descending
  const res1b = await request.get("/image?sortField=filename&sortOrder=desc");
  // should be 200 OK
  expect(res1b.statusCode).toEqual(200);

  // ensure that the images are sorted by filename, descending
  const filenames_2 = res1b.body.map((image: Image) => image.filename);
  // Clone `filenames_2`, sort the clone in ascending order, then reverse it for descending order
  const sortedAndReversedFilenames = [...filenames_2].sort().reverse();
  // Compare the original array to the sorted and reversed clone
  expect(filenames_2).toEqual(sortedAndReversedFilenames);

  // get the ID of the last image (that was added in the previous step)
  const id = images[images.length - 1].id;
  // delete the image
  const res2 = await request.delete(`/image/${id}`);
  // should be 200 OK
  expect(res2.statusCode).toEqual(200);

  // get all images
  const res3 = await request.get("/image");
  // should be 200 OK
  expect(res3.statusCode).toEqual(200);
  // should not contain the deleted image
  expect(res3.body.map((image: Image) => image.id)).not.toContain(id);
});

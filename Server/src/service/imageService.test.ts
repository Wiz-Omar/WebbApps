// imageService.test.ts
import mongoose from "mongoose";
import { ImageService } from "./imageService";
import { IImageService } from "./imageService.interface";
import { LikeService } from "./likeService";
import { UserService } from "./userService";
import { IUserService } from "./userService.interface";
import {Image} from '../model/image';
import { User } from "../model/user";
import { MappingService } from "./mappingService";
import { conn } from "../db/__mocks__/conn";

jest.mock("../db/conn")

afterEach(async () => {
  const c = await conn;
  await c.collection('Users Collection').deleteMany({});
  await c.collection('Images Collection').deleteMany({});
  await c.collection('Like Images Collection').deleteMany({});
  console.log("Finished teardown");
  console.log(await c.db.collection('Users Collection').find({}).toArray());
})

// Testing deletion of an image. Sometimes fails for no reason
test("If an image is added and deleted from the list then it should not be in the list", async () => {
  const imageService: IImageService = new ImageService();
  const userService: IUserService = new UserService();

  await userService.addUser("testUser", "12345678");
  const image: Image = await imageService.addImage('testImage', 'http://test.com', 'testUser'); // Add a mock image for the user 'testUser'.
  let images: Image[] = (await imageService.getImages(undefined, undefined, 'testUser'));
  expect(images.length === 1).toBe(true);
  await imageService.deleteImage(image.id, 'testUser');
  images = await imageService.getImages(undefined, undefined, 'testUser');
  expect(images.some((randomImage) => randomImage.id === image.id)).toBeFalsy();
  expect(images.length === 0).toBe(true);
  console.log(await userService.find('testUser','12345678'));

  //reset database values
  await userService.removeUser('testUser');
});

test("If two images is added and one is deleted from the list then the correct one should be in the list", async () => {
  console.log("Starting test 2");
  const imageService: IImageService = new ImageService();
  const userService: IUserService = new UserService();

  await userService.addUser("testUser", "12345678");
  const image1: Image = await imageService.addImage('testImage1', 'http://test1.com', 'testUser'); // Add a mock image for the user 'testUser'.
  const image2: Image = await imageService.addImage('testImage2', 'http://test2.com', 'testUser'); // Add a mock image for the user 'testUser'.
  let images: Image[] = (await imageService.getImages(undefined, undefined, 'testUser'));
  expect(images.length === 2).toBe(true);
  await imageService.deleteImage(image1.id, 'testUser');
  images = await imageService.getImages(undefined, undefined, 'testUser');
  expect(images.some((randomImage) => randomImage.id === image1.id)).toBeFalsy();
  expect(images.some((randomImage) => randomImage.id === image2.id)).toBeTruthy();
  expect(images.length === 1).toBe(true);
});


/*
test("If a liked image is removed, it should be removed from the liked images array aswell", async() => {
  const likeService = new LikeService();
  const imageService = new ImageService();

  const filename = "test.png";
  const url = "http://example.com/test.jpg";

  // Create image
  const image = await imageService.addImage(filename, url, 'testUser');
  const imageId = image.id;
  //expect(await likeService.isImageLiked(imageId.toString())).toBe(false);

  // Like image
  //await likeService.likeImage(imageId.toString());
  //expect(await likeService.isImageLiked(imageId.toString())).toBe(true);

  // Delete image
  await imageService.deleteImage(imageId);
  const images = await imageService.getImages();

  // Image should not be in images list
  expect(images.some((image) => image.id === imageId)).toBeFalsy();

  //Image should not be in liked images list
  //expect(await likeService.isImageLiked(imageId.toString())).toBe(false);
})

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
import mongoose from "mongoose";
import { IImageService } from "./imageService.interface";
import { UnorderedBulkOperation } from "mongodb";
import { IUserService } from "./userService.interface";
import { UserService } from "./userService";

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
*/
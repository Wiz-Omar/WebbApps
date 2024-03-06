// likeService.test.ts
import { ImageService } from "./imageService";
import { IImageService } from "./imageService.interface";
import { LikeService } from "./likeService";
import { UserService } from "./userService";
import { IUserService } from "./userService.interface";
import {Image} from '../model/image';
import { ILikeService } from "./likeService.interface";

jest.mock("../db/conn")

test("If an image is liked, it should be in the liked images list", async () => {
  const likeService: ILikeService = new LikeService();
  const imageService: IImageService = new ImageService();
  const userService: IUserService = new UserService();

  await userService.addUser("testUser", "12345678");
  const image: Image = await imageService.addImage('testImage', 'http://test.com', 'testUser'); // Add a mock image for the user 'testUser'.
  await likeService.likeImage(image.id, 'testUser');
  const likedImagesIds = await likeService.getLikedImages('testUser');
  expect(likedImagesIds).toContain(image.id);

  //reset database values
  await imageService.deleteImage(image.id, 'testUser'); //Assuming this deletes the image from likedImages as well
  await userService.removeUser('testUser');
});

test("If an image is unliked, it should not be in the liked images list", async () => {
  const likeService: ILikeService = new LikeService();
  const imageService: IImageService = new ImageService();
  const userService: IUserService = new UserService();

  await userService.addUser("testUser", "12345678");
  const image: Image = await imageService.addImage('testImage', 'http://test.com', 'testUser'); // Add a mock image for the user 'testUser'.
  await likeService.likeImage(image.id, 'testUser'); //Assuming liking works, as shown in the test above
  await likeService.unlikeImage(image.id, 'testUser');
  const likedImagesIds = await likeService.getLikedImages('testUser');
  expect(likedImagesIds).not.toContain(image.id);

  //reset database values
  await imageService.deleteImage(image.id, 'testUser'); //Assuming this deletes the image from likedImages as well
  await userService.removeUser('testUser');
});

test("If an image is not liked, then the like status should be false", async () => {
  const likeService: ILikeService = new LikeService();
  const imageService: IImageService = new ImageService();
  const userService: IUserService = new UserService();

  await userService.addUser("testUser", "12345678");
  const image: Image = await imageService.addImage('testImage', 'http://test.com', 'testUser'); // Add a mock image for the user 'testUser'.
  const isLiked: Boolean = await likeService.isImageLiked(image.id, 'testUser');
  expect(isLiked).toBe(false);

  //reset database values
  await imageService.deleteImage(image.id, 'testUser'); //Assuming this deletes the image from likedImages as well
  await userService.removeUser('testUser');
});

// If an image is liked, then the like status should be true
test("If an image is liked, then the like status should be true", async () => {
  const likeService: ILikeService = new LikeService();
  const imageService: IImageService = new ImageService();
  const userService: IUserService = new UserService();

  await userService.addUser("testUser", "12345678");
  const image: Image = await imageService.addImage('testImage', 'http://test.com', 'testUser'); // Add a mock image for the user 'testUser'.
  await likeService.likeImage(image.id, 'testUser');
  const isLiked: Boolean = await likeService.isImageLiked(image.id, 'testUser');
  expect(isLiked).toBe(true);

  //reset database values
  await imageService.deleteImage(image.id, 'testUser'); //Assuming this deletes the image from likedImages as well
  await userService.removeUser('testUser');
});
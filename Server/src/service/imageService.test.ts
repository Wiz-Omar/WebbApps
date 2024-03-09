// imageService.test.ts

jest.mock("./mappingService");
jest.mock("./pathService");
jest.mock("./likeService");
jest.mock("./databaseImageService");

import { ImageService } from "./imageService";
import { Image } from "../model/image";
import { MockPathService } from "./pathService.mock";
import { MockLikeService } from "./likeService.mock";
import { MockDatabaseImageService } from "./databaseImageService.mock";
import { IImageService } from "./imageService.interface";

import { IPathService } from "./pathService.interface";
import { ILikeService } from "./likeService.interface";
import { IDatabaseImageService } from "./databaseImageService.interface";
import { IUserService } from "./userService.interface";
import { MockUserService, USER } from "./userService.mock";
import { Sorting } from "../model/sorting";

let imageService : IImageService;
let mockUserService : IUserService;
let mockPathService : IPathService;
let mockLikeService : ILikeService;
let mockDatabaseImageService : IDatabaseImageService;

// Reset and reinitialize mocks and service before each test
beforeEach(() => {
  // Reinitialize mocks
  mockUserService = new MockUserService();
  mockPathService = new MockPathService();
  mockLikeService = new MockLikeService();
  mockDatabaseImageService = new MockDatabaseImageService();

  // Re-setup ImageService with the new mocks
  imageService = new ImageService(mockUserService, mockPathService, mockLikeService, mockDatabaseImageService);

  // Clear all mocks (if jest.clearAllMocks() is not enough or you have custom clearing logic)
});

describe('ImageService', () => {
  // Constants for reused values
  const TEST_USERNAME = USER.username;
  const TEST_FILENAME = 'test.jpg';
  const TEST_DATA = 'base64imageData';
  const NEW_FILENAME = 'newFilename.jpg';
  const SEARCH_QUERY = 'test';
  const NON_EXISTING_IMAGE_ID = 'nonExistingId';

  test('Should successfully add and delete an image', async () => {
    const imagesBefore: Image[] = await imageService.getImages(undefined, TEST_USERNAME, undefined);
    expect(imagesBefore.length).toEqual(0);

    const image = await imageService.addImage(TEST_FILENAME, TEST_DATA, TEST_USERNAME);
    expect(image).toBeDefined();

    const imagesDuring = await imageService.getImages(undefined, TEST_USERNAME, undefined);
    expect(imagesDuring.length).toEqual(1);
    
    const imageId = image.id;
    const response = await imageService.deleteImage(imageId, TEST_USERNAME);
    expect(response).toBeTruthy();
  
    const imagesAfter = await imageService.getImages(undefined, TEST_USERNAME, undefined);
    expect(imagesAfter.length).toEqual(0);
  });

  test('Should throw an error when adding an image that already exists', async () => {
    let errorOccurred = false;
    await imageService.addImage(TEST_FILENAME, TEST_DATA, TEST_USERNAME);
    try {
      await imageService.addImage(TEST_FILENAME, TEST_DATA, TEST_USERNAME);
    } catch (error) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
  });

  test('Should change the name of an image successfully', async () => {
    const image = await imageService.addImage(TEST_FILENAME, TEST_DATA, TEST_USERNAME);
    const imageId = image.id;
    const result = await imageService.changeImageName(imageId, NEW_FILENAME, TEST_USERNAME);
    expect(result).toBeTruthy();
  });

  test('Should throw an ImageNotFoundError for operations on non-existing images', async () => {
    await expect(imageService.changeImageName(NON_EXISTING_IMAGE_ID, NEW_FILENAME, TEST_USERNAME)).rejects.toThrow(Error);
    await expect(imageService.deleteImage(NON_EXISTING_IMAGE_ID, TEST_USERNAME)).rejects.toThrow(Error);
  });

  test('Should return a list of images sorted by filename in ascending order', async () => {
    const sorting: Sorting  = { sortField: 'filename', sortOrder: 'asc' };
    const images = await imageService.getImages(sorting, TEST_USERNAME, undefined);
    expect(images).toBeDefined();
  });

  test('Should return a list of images with matching search query', async () => {
    await imageService.addImage('test1.jpg', TEST_DATA, TEST_USERNAME);
    await imageService.addImage('test2.jpg', TEST_DATA, TEST_USERNAME);
    await imageService.addImage('test3.jpg', TEST_DATA, TEST_USERNAME);

    const sorting: Sorting  = { sortField: 'filename', sortOrder: 'asc' };
    const images = await imageService.getImages(sorting, TEST_USERNAME, undefined);
    expect(images.length).toBe(3);

    const searchedImages = await imageService.getImageBySearch(SEARCH_QUERY, TEST_USERNAME);
    expect(searchedImages.length).toBe(3);
  });
});

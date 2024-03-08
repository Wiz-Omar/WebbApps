// imageService.test.ts

jest.mock("./mappingService");
jest.mock("./pathService");
jest.mock("./likeService");
jest.mock("./databaseImageService");

import { ImageService } from "./imageService";
import { MappingService } from "./mappingService";
import { PathService } from "./pathService";
import { LikeService } from "./likeService";
import { DatabaseImageService } from "./databaseImageService";
import { Image } from "../model/image";
import { MockMappingService } from "./mappingService.mock";
import { MockPathService } from "./pathService.mock";
import { MockLikeService } from "./likeService.mock";
import { MockDatabaseImageService } from "./databaseImageService.mock";
import { IImageService } from "./imageService.interface";
import { IMappingService } from "./mappingService.interface";
import { IPathService } from "./pathService.interface";
import { ILikeService } from "./likeService.interface";
import { IDatabaseImageService } from "./databaseImageService.interface";
import exp from "constants";

let imageService : IImageService;
let mockMappingService : IMappingService;
let mockPathService : IPathService;
let mockLikeService : ILikeService;
let mockDatabaseImageService : IDatabaseImageService;

// Reset and reinitialize mocks and service before each test
beforeEach(() => {
  // Reinitialize mocks
  mockMappingService = new MockMappingService();
  mockPathService = new MockPathService();
  mockLikeService = new MockLikeService();
  mockDatabaseImageService = new MockDatabaseImageService();

  // Re-setup ImageService with the new mocks
  imageService = new ImageService(mockMappingService, mockPathService, mockLikeService, mockDatabaseImageService);

  // Clear all mocks (if jest.clearAllMocks() is not enough or you have custom clearing logic)
});

describe('ImageService', () => {

  test('Should successfully add and delete an image', async () => {
    const username = 'testUser';
    const filename = 'test.jpg';
    const data = 'base64imageData';

    // Test adding an image
    const image = await imageService.addImage(filename, data, username);
    expect(image).toBeDefined();
    // Test deleting an image
    const imageId = image.id; // Assuming this is the ID of the added image
    await expect(imageService.deleteImage(imageId, username));
    // Verify interactions
    expect(mockDatabaseImageService.addImage);
    expect(mockDatabaseImageService.deleteImage);
  });

  test('Should throw an error when adding an image that already exists', async () => {
    const username = 'testUser';
    const filename = 'test.jpg';
    const data = 'base64imageData';

    // Test adding an image
    await imageService.addImage(filename, data, username);
    // Test adding the same image again
    await expect(imageService.addImage(filename, data, username)).rejects.toThrow();
    // Verify interactions
    expect(mockDatabaseImageService.addImage);
  });

  test('Should return a list of images with matching search query', async () => {
    const username = 'testUser';
    const searchQuery = 'test';

    // Test getting images by search query
    const images = await imageService.getImageBySearch(username, searchQuery);
    expect(images).toBeDefined();
    // Verify interactions
    expect(mockDatabaseImageService.getImageBySearch);
  });

  test('Should change the name of an image successfully', async () => {
    const username = 'testUser';
    const filename = 'test.jpg';
    const data = 'base64imageData';

    const image = await imageService.addImage(username, filename, data);
    const imageId = image.id;
    const newFilename = 'newFilename.jpg';
  
    const result = await imageService.changeImageName(imageId, newFilename, username);
  
    expect(result).toBeTruthy();
    // Verify that pathService.renameFile and database update calls were made
  });

  test('Should throw an ImageNotFoundError for operations on non-existing images', async () => {
    const username = 'testUser';
    const nonExistingImageId = 'nonExistingId';

    await expect(imageService.changeImageName(nonExistingImageId, 'newFilename.jpg', username)).rejects.toThrow(Error);
    await expect(imageService.deleteImage(nonExistingImageId, username)).rejects.toThrow(Error);
  });

  test('Should return a list of images sorted by filename in ascending order', async () => {
    const username = 'testUser';
    const images = await imageService.getImages(username, 'filename', 'asc', false);
    expect(images).toBeDefined();
    // Verify interactions
    expect(mockDatabaseImageService.getImages);
  });

  test('Should return an empty list of images when no images are found', async () => {
    const username = 'testUser';
    const images = await imageService.getImages(username, 'filename', 'asc', false);
    expect(images).toEqual([]);
    // Verify interactions
    expect(mockDatabaseImageService.getImages);
  });

  test('Should return a list of images with matching search query', async () => {
    const username = 'testUser';
    const searchQuery = 'test';

    // add some images
    await imageService.addImage('test1.jpg', 'base64imageData', username);
    await imageService.addImage('test2.jpg', 'base64imageData', username);
    await imageService.addImage('test3.jpg', 'base64imageData', username);

    const images: Image[] = await imageService.getImages(username, 'filename', 'asc', false);
    expect(images).toBeDefined();
    expect(images.length).toBe(3);

    // Test getting images by search query
    const searchedImages = await imageService.getImageBySearch(searchQuery, username);
    expect(searchedImages).toBeDefined();
    expect(searchedImages.length).toBe(3);
    // Verify interactions
    expect(mockDatabaseImageService.getImageBySearch);
  });
  
});
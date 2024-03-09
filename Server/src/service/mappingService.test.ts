import { MappingService } from './mappingService';
import { userModel } from '../db/users.db';
import { imageModel } from '../db/image.db';
import { UserNotFoundError } from '../errors/userErrors';
import { ObjectId } from 'mongodb';

// Mocking database
jest.mock("../db/conn")

describe('MappingService', () => {
  let mappingService = new MappingService;

  beforeEach(() => {
    // Reset mock implementation before each test
    jest.clearAllMocks();
  });

  test('Should return the mocked user from database by the username', async () => {
    const mockUser = {
      _id: new ObjectId('62092a1a0000000000000000'),
      username: 'testUser',
      password: 'testPassword',
    };
    
    // Mocking the findOne method of userModel to resolve with mockUser
    (await userModel).findOne = jest.fn().mockResolvedValue(mockUser);

    // Calling the getUser method of mappingService
    const user = await mappingService.getUser('testUser');

    // Expecting the returned user to match the mockUser
    expect(user).toEqual({
      id: '62092a1a0000000000000000',
      username: 'testUser',
      password: 'testPassword',
    });
  });

  test('Should return the correct mocked user, found by the username from database', async () => {
    const mockUser1 = {
      _id: new ObjectId('62092a1a0000000000000001'),
      username: 'testUser1',
      password: 'testPassword1',
    };

    const mockUser2 = {
      _id: new ObjectId('62092a1a0000000000000002'),
      username: 'testUser2',
      password: 'testPassword2',
    };

    // Mocking the findOne method of userModel to resolve with mockUser1 and mockUser2
    (await userModel).findOne = jest.fn().mockResolvedValue(mockUser1);
    (await userModel).findOne = jest.fn().mockResolvedValue(mockUser2);

    // Calling the getUser method of mappingService
    const user = await mappingService.getUser('testUser2');

    // Expecting the returned user to match mockUser2
    expect(user).toEqual({
      id: '62092a1a0000000000000002',
      username: 'testUser2',
      password: 'testPassword2',
    });

  });

  test('Expect an error when trying to get a user that does not exist from database', async () => {

    // Mocking the findOne method of userModel to resolve with null
    (await userModel).findOne = jest.fn().mockResolvedValue(null);

    // Expecting the getUser method to throw UserNotFoundError 
    await expect(mappingService.getUser('nonExistingUser')).rejects.toThrow(UserNotFoundError);
    
  });

  test('Should return the mocked image from database by the imageId', async () => {
    // Mock the a date 
    const mockedDate = new Date('2024-03-10T00:00:00.000Z');

    const mockImage = {
      _id: new ObjectId('62092a1a0000000000000003'),
      filename: "mockFilename.jpg",
      path: "mock/path/to/image.jpg",
      uploadDate: mockedDate,
    };
    
    // Mocking the findOne method of imageModel to resolve with mockImage
    (await imageModel).findOne = jest.fn().mockResolvedValue(mockImage);

    // Calling the getImage method of mappingService
    const image = await mappingService.getImage('62092a1a0000000000000003');

    // Expecting the returned image to match the mockImage
    expect(image).toEqual({
      id: '62092a1a0000000000000003',
      filename: "mockFilename.jpg",
      path: "mock/path/to/image.jpg",
      uploadDate: mockedDate,
    });
  });

  test('Should return the correct mocked image from database by the imageId', async () => {
    // Mock the dates 
    const mockedDate1 = new Date('2024-03-10T00:00:00.000Z');
    const mockedDate2 = new Date('2024-01-10T00:00:00.000Z');

    const mockImage1 = {
      _id: new ObjectId('62092a1a0000000000000004'),
      filename: "mockFilename1.jpg",
      path: "mock/path/to/image1.jpg",
      uploadDate: mockedDate1,
    };

    const mockImage2 = {
      _id: new ObjectId('62092a1a0000000000000005'),
      filename: "mockFilename2.jpg",
      path: "mock/path/to/image2.jpg",
      uploadDate: mockedDate2,
    };
    
    // Mocking the findOne method of imageModel to resolve with mockImage1 and mockImage2
    (await imageModel).findOne = jest.fn().mockResolvedValue(mockImage1);
    (await imageModel).findOne = jest.fn().mockResolvedValue(mockImage2);

    // Calling the getImage method of mappingService
    const image = await mappingService.getImage('62092a1a0000000000000005');

    // Expecting the returned image to match the mockImage
    expect(image).toEqual({
      id: '62092a1a0000000000000005',
      filename: "mockFilename2.jpg",
      path: "mock/path/to/image2.jpg",
      uploadDate: mockedDate2,
    });
  });

  test('Expect an error when trying to get a user that does not exist from database', async () => {

    // Mocking the findOne method of imageModel to resolve with null
    (await imageModel).findOne = jest.fn().mockResolvedValue(null);

    // Expecting the getImage method to throw Error 
    await expect(mappingService.getImage('nonExistingImage')).rejects.toThrow(Error);
    
  });

});


import { DatabaseImage, MappingService } from './mappingService';
import { ObjectId } from 'mongodb';
import { DatabaseUser } from '../service/mappingService';
import { User } from '../model/user';
import { Image } from '../model/image';

describe('MappingService', () => {

  test('mapDatabaseUserToUser should correctly map a DatabaseUser to a User', () => {
    const mockDatabaseUser: DatabaseUser = {
      _id: new ObjectId('62092a1a0000000000000000'),
      username: 'testUser',
      password: 'testPassword',
    };

    const expectedUser: User = {
      id: '62092a1a0000000000000000',
      username: 'testUser',
      password: 'testPassword',
    };

    const mappedUser = MappingService.mapDatabaseUserToUser(mockDatabaseUser);
    expect(mappedUser).toEqual(expectedUser);
  });

  test('mapDatabaseImageToImage should correctly map a DatabaseImage to an Image', () => {
    const mockDatabaseImage: DatabaseImage = {
      _id: new ObjectId('62092a1a0000000000000003'),
      filename: "mockFilename.jpg",
      path: "mock/path/to/image.jpg",
      uploadDate: new Date('2024-03-10T00:00:00.000Z'),
    };

    const expectedImage: Image = {
      id: '62092a1a0000000000000003',
      filename: "mockFilename.jpg",
      path: "mock/path/to/image.jpg",
      uploadDate: new Date('2024-03-10T00:00:00.000Z'),
    };

    const mappedImage = MappingService.mapDatabaseImageToImage(mockDatabaseImage);
    expect(mappedImage).toEqual(expectedImage);
  });

});

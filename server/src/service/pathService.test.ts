// LocalPathService.test.ts
import * as fs from 'fs/promises';
import { PathService } from './pathService'; // Adjust the import path as necessary
import path from 'path';

// TypeScript requires manual typing for module mocks
jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  rename: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
  access: jest.fn().mockResolvedValue(undefined),
}));

describe('LocalPathService', () => {
  const basePath = '/fake/base/path';
  const service = new PathService('/fake/base/path');

  describe('saveFile', () => {
    it('should save a file and return the path', async () => {
      const userId = 'user1';
      const fileName = 'test.jpg';
      const tempFilePath = '/temp/path/test.jpg';
      const expectedPath = '/fake/base/path/user1/test.jpg';

      const path = await service.saveFile(userId, fileName, tempFilePath);

      expect(path).toEqual(expectedPath);
      expect(fs.rename).toHaveBeenCalledWith(tempFilePath, expectedPath);
    });
  });

  describe('getPath', () => {
    it('should return the correct path if the file exists', async () => {
      const userId = 'user1';
      const imageId = 'image.jpg';
      const expectedPath = path.join(basePath, userId, imageId);

      const filePath = await service.getPath(userId, imageId);

      expect(filePath).toEqual(expectedPath);
      expect(fs.access).toHaveBeenCalledWith(expectedPath);
    });

    it('should throw an error if the file does not exist', async () => {
      const userId = 'user2';
      const imageId = 'nonexistent.jpg';
      (fs.access as jest.Mock).mockRejectedValueOnce(new Error('File not found'));

      await expect(service.getPath(userId, imageId)).rejects.toThrow('File not found');
    });
  });

  describe('deleteFile', () => {
    it('should successfully delete a file', async () => {
      const userId = 'user1';
      const imageId = 'image.jpg';
      const filePathToDelete = path.join(basePath, userId, imageId);

      await service.deleteFile(userId, imageId);

      expect(fs.unlink).toHaveBeenCalledWith(filePathToDelete);
    });

    it('should throw an error if the file to delete does not exist', async () => {
      const userId = 'user2';
      const imageId = 'nonexistent.jpg';
      (fs.unlink as jest.Mock).mockRejectedValueOnce(new Error('Failed to delete file or file not found'));

      await expect(service.deleteFile(userId, imageId)).rejects.toThrow('Failed to delete file or file not found');
    });
  });

  
});

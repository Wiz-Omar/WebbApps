import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import { IPathService } from './IPathService';

//TODO: define own error types!
export class LocalPathService implements IPathService {
  private basePath: string;
  public uploadMiddleware: multer.Multer;

  constructor(basePath: string = path.join(__dirname, '..', 'public/images/')) {
    this.basePath = basePath;
    this.uploadMiddleware = multer({
      // Configure Multer to save uploaded files to a temporary directory
      dest: 'temp/',
    });
  }

  async getPaths(userId: string): Promise<string[]> {
    const userFolderPath = path.join(this.basePath, userId);
    try {
      const files = await fs.readdir(userFolderPath);
      return files.map((file) => path.join(userFolderPath, file));
    } catch {
      throw new Error('Failed to get files');
    }
  }

  async saveFile(userId: string, fileName: string, tempFilePath: string): Promise<string> {
    const userFolderPath = path.join(this.basePath, userId); //basepath/userid
    const finalFilePath = path.join(userFolderPath, fileName); //basepath/userid/filename

    try {
      await fs.mkdir(userFolderPath, { recursive: true });
      // Move the file from the temporary directory to the final destination
      await fs.rename(tempFilePath, finalFilePath);
      return finalFilePath;
    } catch (error) {
      throw new Error('Failed to save file');
    }
  }

  async getPath(userId: string, imageId: string): Promise<string> {
    const filePath = path.join(this.basePath, userId, imageId);
    // Verify the file exists
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      throw new Error('File not found');
    }
  }

  async deleteFile(userId: string, imageId: string): Promise<void> {
    const filePath = path.join(this.basePath, userId, imageId);
    try {
      await fs.unlink(filePath);
    } catch {
      throw new Error('Failed to delete file or file not found');
    }
  }
}

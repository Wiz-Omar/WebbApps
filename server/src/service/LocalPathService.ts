import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { IPathService } from "./IPathService";

//TODO: define own error types!
export class LocalPathService implements IPathService {
  private basePath: string;
  public uploadMiddleware: multer.Multer;

  constructor(basePath: string = path.join(process.cwd(), "public", "images")) {
    this.basePath = basePath;
    this.uploadMiddleware = multer({
      // Configure Multer to save uploaded files to a temporary directory within the project
      dest: path.join(process.cwd(), "temp"),
    });
  }
  
  async getPaths(userId: string): Promise<string[]> {
    const userFolderPath = path.join(this.basePath, userId);
    try {
      const files = await fs.readdir(userFolderPath);
      return files.map((file) => path.join(userFolderPath, file));
    } catch {
      throw new Error("Failed to get files");
    }
  }

  async saveFile(userId: string, fileName: string, base64Data: string): Promise<string> {
    const userFolderPath = path.join(this.basePath, userId); // basePath/userId
    const finalFilePath = path.join(userFolderPath, fileName); // basePath/userId/filename
    const relativeFilePath = path.join('images', userId, fileName); // images/userId/filename - this is the relative path
    const baseUrl = 'http://localhost:8080'; // The base URL of the server
    try {
      await fs.mkdir(userFolderPath, { recursive: true });
      // Decode the base64 string to a buffer
      const fileBuffer = Buffer.from(base64Data, "base64");
      // Write the buffer to the final file path
      await fs.writeFile(finalFilePath, fileBuffer);
      return `${baseUrl}/${relativeFilePath}`;
    } catch (error) {
      throw new Error("Failed to save file");
    }
  }
  
  async getPath(userId: string, imageId: string): Promise<string> {
    const filePath = path.join(this.basePath, userId, imageId);
    // Verify the file exists
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      throw new Error("File not found");
    }
  }

  async deleteFile(userId: string, filename: string): Promise<void> {
    console.log("Deleting file", userId, filename);
    const filePath = path.join(this.basePath, userId, filename);
    try {
      await fs.unlink(filePath);
    } catch {
      throw new Error("Failed to delete file or file not found");
    }
  }
}

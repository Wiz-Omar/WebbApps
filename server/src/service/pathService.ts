import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { IPathService } from "./pathService.interface";

//TODO: define own error types!
export class PathService implements IPathService {
  private basePath: string;
  public uploadMiddleware: multer.Multer;

  constructor(basePath: string = path.join(process.cwd(), "public", "images")) {
    this.basePath = basePath;
    this.uploadMiddleware = multer({
      // Configure Multer to save uploaded files to a temporary directory within the project
      dest: path.join(process.cwd(), "temp"),
    });
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

  async deleteFile(userId: string, filename: string): Promise<void> {
    console.log("Deleting local file path", userId, filename);
    const filePath = path.join(this.basePath, userId, filename);
    try {
      // Delete the specified file
      await fs.unlink(filePath);

      // Check if the directory is empty after deleting the file
      const directoryPath = path.join(this.basePath, userId);
      const files = await fs.readdir(directoryPath);

      if (files.length === 0) {
          // Directory is empty, so delete it
          await fs.rmdir(directoryPath);
          console.log(`Deleted empty directory: ${directoryPath}`);
      }
    } catch {
      throw new Error("Failed to delete file or file not found");
    }
  }

  async renameFile(userId: string, oldFilename: string, newFilename: string): Promise<string> {
    const userFolderPath = path.join(this.basePath, userId);
    const oldFilePath = path.join(userFolderPath, oldFilename);
    const newFilePath = path.join(userFolderPath, newFilename);
    const baseUrl = 'http://localhost:8080'; // The base URL of the server
    const relativeFilePath = path.join('images', userId, newFilename); // images/userId/filename - this is the relative path

    try {
        // Check if the old file exists
        await fs.access(oldFilePath);
        // Rename the file
        await fs.rename(oldFilePath, newFilePath);
        return `${baseUrl}/${relativeFilePath}`;
    } catch (error) {
        throw new Error("Failed to rename file or file not found");
    }
}

}

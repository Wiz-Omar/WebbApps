import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { IPathService } from "./pathService.interface";
import { FileOperationError as FilePathError } from "../errors/imageErrors";

// Defined constants for easier modification and configuration
const DEFAULT_BASE_PATH = path.join(process.cwd(), "public", "images");
const TEMPORARY_UPLOADS_PATH = path.join(process.cwd(), "temp");
const IMAGES_FOLDER_NAME = "images";
const SERVER_BASE_URL = "http://localhost:8080"; // Consider moving to an environment variable

/**
 * Service for handling file path operations.
 * It is responsible for saving, deleting, and renaming files to the file system.
 * Uses multer for file uploads and fs for file operations.
 */
export class PathService implements IPathService {
  private basePath: string;
  public uploadMiddleware: multer.Multer;
  private baseUrl: string;

  constructor(
    basePath: string = DEFAULT_BASE_PATH,
    baseUrl: string = SERVER_BASE_URL
  ) {
    this.basePath = basePath;
    this.baseUrl = baseUrl;
    this.uploadMiddleware = multer({
      dest: TEMPORARY_UPLOADS_PATH,
    });
  }

  /**
   * Retrieves the path to the folder for a specific user.
   */
  private getUserFolderPath(userId: string): string {
    return path.join(this.basePath, userId);
  }

  /**
   * Retrieves the path to a specific file for a specific user.
   */
  private getFilePath(userId: string, fileName: string): string {
    return path.join(this.getUserFolderPath(userId), fileName);
  }

  /**
   * Retrieves the relative path to a specific file for a specific user.
   */
  private getRelativeFilePath(userId: string, fileName: string): string {
    return path.join(IMAGES_FOLDER_NAME, userId, fileName);
  }

  /**
   * Retrieves the full URL for a specific file.
   */
  private getFullUrl(relativePath: string): string {
    return `${this.baseUrl}/${relativePath}`;
  }

  /**
   * Saves a file to the file system.
   * @param userId Unique identifier for the user
   * @param fileName The name of the file
   * @param base64Data The base64 encoded file data
   * 
   * @throws {FilePathError} If the file cannot be saved
   * 
   * @returns A promise that resolves to the URL of the saved file
   */
  async saveFile(
    userId: string,
    fileName: string,
    base64Data: string
  ): Promise<string> {
    const userFolderPath = this.getUserFolderPath(userId);
    const finalFilePath = this.getFilePath(userId, fileName);
    const relativeFilePath = this.getRelativeFilePath(userId, fileName);

    try {
      await fs.mkdir(userFolderPath, { recursive: true });
      const fileBuffer = Buffer.from(base64Data, "base64");
      await fs.writeFile(finalFilePath, fileBuffer);
      return this.getFullUrl(relativeFilePath);
    } catch (error) {
      throw new FilePathError();
    }
  }

  /**
   * Deletes a file from the file system.
   * @param userId Unique identifier for the user
   * @param filename The name of the file to be deleted
   * 
   * @throws {FilePathError} If the file does not exist or cannot be deleted
   * 
   * @returns A promise that resolves when the file is successfully deleted
   */
  async deleteFile(userId: string, filename: string): Promise<void> {
    const filePath = this.getFilePath(userId, filename);
    try {
      await fs.unlink(filePath);
      const directoryPath = this.getUserFolderPath(userId);
      const files = await fs.readdir(directoryPath);
      if (files.length === 0) {
        await fs.rmdir(directoryPath);
      }
    } catch {
      throw new FilePathError();
    }
  }

  /**
   * Renames a file in the file system.
   * @param userId Unique identifier for the user
   * @param oldFilename The current name of the file
   * @param newFilename The new name for the file
   * 
   * @throws {FilePathError} If the file does not exist or cannot be renamed
   * 
   * @returns A promise that resolves to the new URL for the file
   */
  async renameFile(
    userId: string,
    oldFilename: string,
    newFilename: string
  ): Promise<string> {
    const oldFilePath = this.getFilePath(userId, oldFilename);
    const newFilePath = this.getFilePath(userId, newFilename);
    const relativeFilePath = this.getRelativeFilePath(userId, newFilename);

    try {
      await fs.access(oldFilePath);
      await fs.rename(oldFilePath, newFilePath);
      return this.getFullUrl(relativeFilePath);
    } catch (error) {
      throw new FilePathError();
    }
  }
}

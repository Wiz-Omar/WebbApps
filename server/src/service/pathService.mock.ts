import { IPathService } from "./pathService.interface";

export class MockPathService implements IPathService {
  private basePath: string = "mockBasePath";
  private files: Record<string, string[]> = {}; // Simulate user files

  async saveFile(userId: string, fileName: string, base64Data: string): Promise<string> {
    // Simulate saving the file by adding it to the files object
    if (!this.files[userId]) {
      this.files[userId] = [];
    }
    this.files[userId].push(fileName);

    // Return a mock URL for the saved file
    return `http://localhost:8080/images/${userId}/${fileName}`;
  }

  async deleteFile(userId: string, filename: string): Promise<void> {
    // Simulate deleting the file by removing it from the files object
    if (this.files[userId]) {
      const index = this.files[userId].indexOf(filename);
      if (index > -1) {
        this.files[userId].splice(index, 1);
      } else {
        throw new Error("File not found");
      }
    } else {
      throw new Error("Failed to delete file or file not found");
    }
  }
}

export interface IPathService {
    saveFile(userId: string, fileName: string, base64Data: string): Promise<string>;
    deleteFile(userId: string, imageId: string): Promise<void>;
    renameFile(userId: string, oldFilename: string, newFilename: string): Promise<string>;
  }
  
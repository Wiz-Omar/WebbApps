export interface IPathService {
    saveFile(userId: string, fileName: string, filePath: string): Promise<string>;
    getPath(userId: string, imageId: string): Promise<string>;
    getPaths(userId: string): Promise<string[]>;
    deleteFile(userId: string, imageId: string): Promise<void>;
  }
  
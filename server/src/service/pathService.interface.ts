/**
 * Interface for the path service. It is responsible for saving, deleting and renaming files in the file system.
 */
export interface IPathService {

    /**
     * Saves a file to the file system.
     * @param userId The ID of the user who is saving the file. Type: string
     * @param fileName The name of the file. Type: string
     * @param base64Data The base64 encoded data of the file. Type: string
     */
    saveFile(userId: string, fileName: string, base64Data: string): Promise<string>;

    /**
     * Deletes a file from the file system.
     * @param userId The ID of the user who owns the file. Type: string
     * @param fileName The name of the file. Type: string
     */
    deleteFile(userId: string, imageId: string): Promise<void>;

    /**
     * Renames a file in the file system.
     * @param userId The ID of the user who owns the file. Type: string
     * @param oldFilename The current name of the file. Type: string
     * @param newFilename The new name for the file. Type: string
     */
    renameFile(userId: string, oldFilename: string, newFilename: string): Promise<string>;
  }
  
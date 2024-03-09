/**
 * Image model
 * 
 * Represents an image in the system.
 * 
 * @param {string} id The unique identifier for the image
 * @param {string} filename The name of the file
 * @param {string} path The path to the file
 * @param {Date} uploadDate The date the file was uploaded
 * 
 */
export interface Image {
    id: string;
    filename: string;
    path: string;
    uploadDate: Date;
}
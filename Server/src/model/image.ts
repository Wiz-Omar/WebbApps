export interface Image {
    id: number;
    filename: string;
    // stored as base64 string
    data: string;
    uploadDate: Date;
}
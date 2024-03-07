export const ErrorMessages = {
  Unauthorized: "Unauthorized action. User not logged in",
  InvalidImageID: "Invalid image ID",
  InvalidSortField:
    "Invalid sort field. Valid options are 'filename' or 'uploadDate'.",
  InvalidSortOrder: "Invalid sort order. Valid options are 'asc' or 'desc'.",
  NoSearchQuery: "No search query provided",
  InvalidFilename: "Invalid filename",
  FilenameTooLong: "Filename too long",
  NoFileUploaded: "No file uploaded.",
  FileSizeExceeds: "File size exceeds limit of 10MB.",
  InvalidFileData: "Invalid input data for filename.",
  InvalidFileType: "Invalid file type, only JPEG and PNG are allowed!",
  
  ImageNotFound: "Image not found",
  ImageAlreadyExists: "Image already exists",
};

export const SuccessMessages = {
  ImageUploaded: "Image uploaded successfully",
  ImageDeleted: "Image successfully deleted",
  ImageRenamed: "Image successfully renamed",
};

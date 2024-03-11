// Min length for username
export const MIN_USERNAME_LENGTH = 8;
// Min length for password
export const MIN_PASSWORD_LENGTH = 8;
// Pattern for username
export const USERNAME_PATTERN = /^[a-zA-Z0-9]+$/; // Only alphanumeric characters allowed

// Max length for filename
export const MAX_FILENAME_LENGTH = 256;
// Supported file types for file upload
export const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
// Max file size for file upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
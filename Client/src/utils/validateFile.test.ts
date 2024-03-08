import { validateFile, FileMissingError, FilenameTooLongError, UnsupportedFiletypeError, FileSizeExceededError } from './validateFile';

describe('validateFile function', () => {
  test('throws FileMissingError when file is null', () => {
    expect(() => {
      validateFile(null);
    }).toThrow(FileMissingError);
  });

  test('throws FilenameTooLongError when filename exceeds 256 characters', () => {
    const longFilename = 'a'.repeat(257);
    const file = { name: longFilename, type: 'image/jpeg', size: 100 } as File; // Mock file object
    expect(() => {
      validateFile(file);
    }).toThrow(FilenameTooLongError);
  });

  test('throws UnsupportedFiletypeError when file type is not supported', () => {
    const file = { name: 'test.txt', type: 'text/plain', size: 100 } as File; // Mock file object
    expect(() => {
      validateFile(file);
    }).toThrow(UnsupportedFiletypeError);
  });

  test('throws FileSizeExceededError when file size exceeds 10MB', () => {
    const file = { name: 'test.jpg', type: 'image/jpeg', size: 11 * 1024 * 1024 } as File; // Mock file object
    expect(() => {
      validateFile(file);
    }).toThrow(FileSizeExceededError);
  });

  test('does not throw any error when file is valid', () => {
    const file = { name: 'valid.jpg', type: 'image/jpeg', size: 5 * 1024 * 1024 } as File; // Mock file object
    expect(() => {
      validateFile(file);
    }).not.toThrow();
  });
});

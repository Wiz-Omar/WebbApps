import { Request, Response, NextFunction } from "express";
import { ensureAuthenticated, fileUploadValidation, validateImageId, validateNewImageName, validateSearchQuery, validateSorting, validateUserCredentials } from "./validators";

const LARGE_FILE: Express.Multer.File = {
    fieldname: 'file', // Name of the form field associated with this file.
    originalname: 'test.png', // Original name of the uploaded file.
    encoding: '7bit', // Encoding type of the file.
    mimetype: 'image/png', // MIME type of the file.
    size: 1024 * 1024 * 11, // Size of the file in bytes (example: larger than 10MB for testing size limit).
    destination: 'uploads/', // The folder to which the file has been saved.
    filename: 'uploaded_test.png', // The name of the file within the destination.
    path: 'uploads/uploaded_test.png', // The full path to the uploaded file.
    stream: {}, // The file's stream data. For testing, an empty object can be a placeholder.
  } as Express.Multer.File; // Typecasting to Express.Multer.File to satisfy the expected type.
  
const VALID_FILE: Express.Multer.File = {
    fieldname: 'file', // Name of the form field associated with this file.
    originalname: 'validImage.png', // Original name of the uploaded file.
    encoding: '7bit', // Encoding type of the file.
    mimetype: 'image/png', // MIME type of the file.
    size: 1024 * 1024 * 1, // Size of the file in bytes (example: 1MB).
    destination: 'uploads/', // The folder to which the file has been saved.
    filename: 'validImage_uploaded.png', // The name of the file within the destination.
    path: 'uploads/validImage_uploaded.png', // The full path to the uploaded file.
    stream: {} as NodeJS.ReadableStream, // The file's stream data. For testing, an empty object can be a placeholder.
    buffer: Buffer.from(''), // Optional, only if using memory storage. Empty buffer as a placeholder.
  } as Express.Multer.File;

const INVALID_FILE_TYPE: Express.Multer.File = {
    fieldname: 'file', // Name of the form field associated with this file.
    originalname: 'invalidFile.pdf', // Original name of the uploaded file.
    encoding: '7bit', // Encoding type of the file.
    mimetype: 'application/pdf', // MIME type of the file.
    size: 1024 * 1024 * 1, // Size of the file in bytes (example: 1MB).
    destination: 'uploads/', // The folder to which the file has been saved.
    filename: 'invalidFile_uploaded.pdf', // The name of the file within the destination.
    path: 'uploads/invalidFile_uploaded.pdf', // The full path to the uploaded file.
    stream: {} as NodeJS.ReadableStream, // The file's stream data. For testing, an empty object can be a placeholder.
    buffer: Buffer.from(''), // Optional, only if using memory storage. Empty buffer as a placeholder.
  } as Express.Multer.File;
  

// Mock Response and NextFunction
const mockResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};
const nextFunction: NextFunction = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe("ensureAuthenticated Middleware", () => {
  it("returns 401 if user is not authenticated", () => {
    const mockRequest: Partial<Request> = {};
    ensureAuthenticated(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});

describe("validateImageId Middleware", () => {
  it("calls next() for valid imageId", () => {
    const mockRequest: Partial<Request> = {
      params: { imageId: "123" },
    };
    validateImageId(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });

  it("returns 400 for invalid imageId", () => {
    const mockRequest: Partial<Request> = {
      params: { imageId: "" },
    };
    validateImageId(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});

describe("validateSorting Middleware", () => {
    it("calls next() for valid sortField and sortOrder", () => {
      const mockRequest: Partial<Request> = {
        query: { sortField: "uploadDate", sortOrder: "asc" },
      };
      validateSorting(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });
  
    it("returns 400 for invalid sortField", () => {
      const mockRequest: Partial<Request> = {
        query: { sortField: "invalidField", sortOrder: "asc" },
      };
      validateSorting(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
  
  describe("validateSearchQuery Middleware", () => {
    it("calls next() for valid search query", () => {
      const mockRequest: Partial<Request> = {
        query: { search: "testQuery" },
      };
      validateSearchQuery(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });
  
    it("returns 400 for missing search query", () => {
      const mockRequest: Partial<Request> = {query: { search: ""}};
      validateSearchQuery(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
  
  describe("validateNewImageName Middleware", () => {
    it("calls next() for valid newFilename", () => {
      const mockRequest: Partial<Request> = {
        body: { newFilename: "validName.jpg" },
      };
      validateNewImageName(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });
  
    it("returns 400 for missing newFilename", () => {
      const mockRequest: Partial<Request> = {
        body: {},
      };
      validateNewImageName(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
  
  describe("fileUploadValidation Middleware", () => {
    const mockFile = {
      originalname: "testImage.jpg",
      mimetype: "image/jpeg",
      size: 500000,
    };
  
    it("calls next() for valid file upload", () => {
      const mockRequest: Partial<Request> = {
        file: VALID_FILE,
      };
      fileUploadValidation(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });
  
    it("returns 415 for unsupported file type", () => {
      const invalidFile = { ...mockFile, mimetype: "application/pdf" };
      const mockRequest: Partial<Request> = {
        file: INVALID_FILE_TYPE, // Using the mocked file that's not an image
      };
      fileUploadValidation(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(415);
    });

    it('returns 413 Payload Too Large when the file size exceeds the limit', () => {
        const mockRequest: Partial<Request> = {
          file: LARGE_FILE, // Using the mocked file that's too large
        };
        const mockResponse: Partial<Response> = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn().mockReturnThis(),
        };
        const nextFunction: NextFunction = jest.fn();
    
        fileUploadValidation(mockRequest as Request, mockResponse as Response, nextFunction);
    
        expect(mockResponse.status).toHaveBeenCalledWith(413);
        expect(mockResponse.send).toHaveBeenCalledWith(expect.anything());
        expect(nextFunction).not.toHaveBeenCalled();
      });
  });
  
  describe("validateUserCredentials Middleware", () => {
    it("calls next() for valid username and password", () => {
      const mockRequest: Partial<Request> = {
        body: { username: "validUser", password: "validPassword123" },
      };
      validateUserCredentials(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });
  
    it("returns 400 for invalid username", () => {
      const mockRequest: Partial<Request> = {
        body: { username: "usr", password: "validPassword123" },
      };
      validateUserCredentials(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
  


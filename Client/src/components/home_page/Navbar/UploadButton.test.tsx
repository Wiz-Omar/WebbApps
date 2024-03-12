import React from "react";
import axios, { AxiosStatic } from 'axios';
import UploadButton from "./UploadButton";
import { render, fireEvent, waitFor, queryByTestId } from "@testing-library/react";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

// Mock callback function
const mockCallback = jest.fn();

describe("UploadButton", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test("renders upload button correctly", () => {
    const { getByText, getByTestId } = render(<UploadButton callback={mockCallback} />);
    // const uploadButton = getByText("Upload");
    expect(getByText("Upload")).toBeInTheDocument();
    expect(getByTestId("file-input")).toBeInTheDocument();
  });

  test("triggers file input click when button is clicked", () => {
    const { getByText, getByTestId } = render(<UploadButton callback={mockCallback} />);
    const uploadButton = getByText("Upload");
    const fileInput = getByTestId("file-input");

    // Mock the click function of the file input element
    const mockClick = jest.fn();
    fileInput.click = mockClick;
    
    // Trigger click event on the upload button
    fireEvent.click(uploadButton);

    // Check if the click function of the file input element is called
    expect(fileInput.click).toHaveBeenCalled();
    
  });

  /* test('calls callback function for valid input', async () => {
    mockedAxios.post.mockResolvedValue({ response: { status: 201 } });
    const { getByText } = render(<UploadButton callback={mockCallback} />);

    // const uploadButton = getByText('Upload');
    //fireEvent.click(uploadButton);

    await waitFor(() => fireEvent.click(getByText('Upload')));
    expect(mockCallback).toHaveBeenCalled();
  }); */


  /* test('displays error message for invalid file', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.createElement('input');
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    const { getByText } = render(<UploadButton callback={jest.fn()} />);
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);
    fireEvent.change(fileInput);
    expect(alertMock).toHaveBeenCalledWith('The file type is not supported. Please upload a .jpg, .jpeg, or .png file.');
    alertMock.mockRestore();
  }); */
  

  /* test('displays error message for file too large', async () => {
    mockedAxios.post.mockRejectedValue({ response: { status: 413 } });
    const { getByText } = render(<UploadButton callback={() => {}} />);
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);
    expect(getByText('The file is too large. Please upload a file that is less than 5MB.')).toBeInTheDocument();
  });

  test('displays error message for unsupported file type', async () => {
    mockedAxios.post.mockRejectedValue({ response: { status: 415 } });
    const { getByText } = render(<UploadButton callback={() => {}} />);
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);
    expect(getByText('The file type is not supported. Please upload a .jpg, .jpeg, or .png file.')).toBeInTheDocument();
  });

  test('displays generic error message for other errors', async () => {
    mockedAxios.post.mockRejectedValue({ response: { status: 500 } }); // Any status other than 409, 413, and 415
    const { getByText } = render(<UploadButton callback={() => {}} />);
    const uploadButton = getByText('Upload');
    fireEvent.click(uploadButton);
    expect(getByText('Something went wrong.')).toBeInTheDocument();
  }); */
});

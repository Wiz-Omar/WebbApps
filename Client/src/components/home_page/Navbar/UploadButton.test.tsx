import React from "react";
import UploadButton from "./UploadButton";
import { render, fireEvent, waitFor } from "@testing-library/react";

jest.mock('axios');

// Mock callback function
const mockCallback = jest.fn();

describe("UploadButton", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("renders upload button correctly", () => {
    const { getByText, getByTestId } = render(<UploadButton callback={mockCallback} />);
    expect(getByText("Upload")).toBeInTheDocument();
    expect(getByTestId("file-input")).toBeInTheDocument();
  });

  it("triggers file input click when button is clicked", () => {
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

  it("calls callback function for valid input", async () => {
    const { getByTestId } = render(<UploadButton callback={mockCallback} />);
    const input = getByTestId("file-input");

    // Create a dummy file
    const file = new File(["dummy content"], "test.jpg", { type: "image/jpeg" });

    // Fire file change event with the dummy file
    fireEvent.change(input, { target: { files: [file] } });

    // Wait for the event loop to complete
    await waitFor(() => {});

    // Assert that the callback function was called
    expect(mockCallback).toHaveBeenCalled();
  });

  it("displays alert for file size exceeded error", async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { getByTestId } = render(<UploadButton callback={mockCallback} />);
    const input = getByTestId("file-input");

    // Create a dummy file larger than the allowed size
    const file = new File(["dummy content".repeat(1024 * 1024)], "large_file.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {});

    // Assert that error message was alerted and callback function not called
    expect(alertMock).toHaveBeenCalledWith("File size should be less than 10MB.")
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("displays alert for unsupported file type error", async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { getByTestId } = render(<UploadButton callback={mockCallback} />);
    const input = getByTestId("file-input");

    // Create a dummy file with unsupported file type
    const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {});

    expect(alertMock).toHaveBeenCalledWith("Unsupported filetype. Supported filetypes are JPEG, JPG, and PNG.");
    expect(mockCallback).not.toHaveBeenCalled();
  });

});

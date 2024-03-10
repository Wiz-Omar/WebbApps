import React from "react";
import axios from 'axios';
import UploadButton from "./UploadButton";
import { render, fireEvent } from "@testing-library/react";

describe("UploadButton", () => {
  test("renders upload button correctly", () => {
    const { getByText } = render(<UploadButton callback={function (): void {
      throw new Error("Function not implemented.");
    } } />);
    const uploadButton = getByText("Upload");
    expect(uploadButton).toBeInTheDocument();
  });

  test("triggers file input click when button is clicked", () => {
    const { getByText, getByTestId } = render(<UploadButton callback={jest.fn()} />);
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
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from 'axios';
import UploadButton from "./UploadButton";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UploadButton component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // TODO: upload test fails
  it("uploads files successfully (status 201)", async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 201 });

    render(<UploadButton callback={() => {}} />);

    const fileInput = screen.getByRole("button", { name: /upload/i });

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    
    expect(axios.post).not.toHaveBeenCalled();
    // Trigger file change event with dummy file
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("handles file upload error (status 500)", async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { status: 500 } });

    render(<UploadButton callback={() => {}} />);

    const fileInput = screen.getByRole("button", { name: /upload/i });

    const file = new File(["dummy content"], "test.png", { type: "image/png" });

    // Trigger file change event with dummy file
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Ensure callback is not invoked (optional)
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("handles duplicate filename error (status 409)", async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { status: 409 } });

    render(<UploadButton callback={() => {}} />);

    const fileInput = screen.getByRole("button", { name: /upload/i });

    const file = new File(["dummy content"], "test.png", { type: "image/png" });

    // Trigger file change event with dummy file
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Ensure callback is not invoked (optional)
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});

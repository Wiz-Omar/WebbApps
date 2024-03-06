import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios, { AxiosResponse } from 'axios';
import UploadButton from "./UploadButton";

jest.mock('axios');

describe('UploadButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handles empty file correctly", async () => {
    const callbackMock = jest.fn();

    render(<UploadButton callback={callbackMock} />);

    const fileInput = screen.getByRole("button", { name: /upload/i });

    // Trigger file change event with empty file
    fireEvent.change(fileInput, { target: { files: [] } });

    // Ensure axios is not called and callback is not triggered
    await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    expect(callbackMock).not.toHaveBeenCalled();
  });

  test("handles long filename correctly", async () => {
    const callbackMock = jest.fn();

    render(<UploadButton callback={callbackMock} />);

    // Mock a file with long filename
    const longFilename = "a".repeat(257);
    const file = new File(["dummy content"], longFilename, { type: "image/jpeg" });
    const fileInput = screen.getByRole("button", { name: /upload/i });

    // Trigger file change event with file having long filename
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Ensure axios is not called and callback is not triggered
    await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    expect(callbackMock).not.toHaveBeenCalled();
  });

  test("handles unsupported file type correctly", async () => {
    const callbackMock = jest.fn();

    render(<UploadButton callback={callbackMock} />);

    // Mock a file with unsupported type
    const file = new File(["dummy content"], "test.txt", { type: "text/plain" });
    const fileInput = screen.getByRole("button", { name: /upload/i });

    // Trigger file change event with unsupported file type
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Ensure axios is not called and callback is not triggered
    await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
    expect(callbackMock).not.toHaveBeenCalled();
  });
});
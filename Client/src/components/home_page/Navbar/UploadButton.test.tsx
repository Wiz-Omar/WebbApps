import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from 'axios';
import UploadButton from "./UploadButton";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/* describe("UploadButton component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
}); */


/* 
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
}); */

// src/types/index.ts
export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// src/api/index.ts
export const getTodos = async (): Promise<Todo[]> => {
    try {
        const url = 'https://jsonplaceholder.typicode.com/todos';
        const resp = await axios.get(url);
        if (resp.status !== 200) {
            throw new Error('Something went wrong');
        }
        const data: Todo[] = await resp.data;
        return data;
    } catch (err) {
        throw err;
    }
};

// src/api/index.spec.ts
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
//jest.mock(...) is used to automatically mock the axios 
// Create an object of type of mocked Axios.
describe('getTodos()', () => {
  test('should return todo list', async () => {    

    //Our desired output
    const todos: Todo[] = [
      {
          userId: 1,
          id: 1,
          title: 'todo-test-1',
          completed: false,
      },
      {
          userId: 2,
          id: 2,
          title: 'todo-test-2',
          completed: true,
      },
    ];
    
    //Prepare the response we want to get from axios
    const mockedResponse: AxiosResponse = {
      data: todos,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };    

    // Make the mock return the custom axios response
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);    
    expect(axios.get).not.toHaveBeenCalled();
    const data = await getTodos();
    expect(axios.get).toHaveBeenCalled();
    expect(data).toEqual(todos);
  });
});
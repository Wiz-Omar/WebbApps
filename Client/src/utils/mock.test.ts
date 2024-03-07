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
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
//jest.mock(...) is used to automatically mock the axios module.jest.mock('axios');// Create an object of type of mocked Axios.
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('getTodos()', () => {
  test('should return todo list', async () => {    //Our desired output
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
    mockedAxios.get.mockResolvedValueOnce(mockedResponse);    expect(axios.get).not.toHaveBeenCalled();
    const data = await getTodos();
    expect(axios.get).toHaveBeenCalled();
    expect(data).toEqual(todos);
  });
});
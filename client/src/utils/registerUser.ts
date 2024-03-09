// src/api/apiCalls.ts
import axios, { AxiosResponse } from "axios";

export const registerUser = async (username: string, password: string): Promise<AxiosResponse<any,any>> => {
  const response = await axios.post("http://localhost:8080/user", {
    username,
    password,
  });

  return response;
};

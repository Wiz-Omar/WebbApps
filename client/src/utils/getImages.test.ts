import axios from 'axios';
import { handleDelete } from './handleDelete';
import { getImages } from './getImages';
import { API_BASE_URL } from '../constants/apiEndpoints';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getImages", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

  it("should fetch images successfully from the API", async () => {
    const testData = [
      {
        id: 1,
        filename: "image1.jpg",
        path: "/images/image1.jpg",
        uploadDate: new Date(),
      },
      {
        id: 2,
        filename: "image2.jpg",
        path: "/images/image2.jpg",
        uploadDate: new Date(),
      },
    ];

    mockedAxios.get.mockResolvedValue({ data: testData });

    const result = await getImages();
    expect(result).toEqual(testData);
    expect(axios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/image?sortField=uploadDate&sortOrder=desc&onlyLiked=false`
    );
  });

  it("should handle sorting and filtering parameters correctly", async () => {
    const testData = [
      {
        id: 3,
        filename: "image3.jpg",
        path: "/images/image3.jpg",
        uploadDate: new Date(),
      },
    ];
    const sortField = "filename";
    const sortOrder = "asc";
    const onlyLiked = true;

    mockedAxios.get.mockResolvedValue({ data: testData });

    const result = await getImages(sortField, sortOrder, onlyLiked);
    expect(result).toEqual(testData);
    expect(axios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/image?sortField=${sortField}&sortOrder=${sortOrder}&onlyLiked=${onlyLiked}`
    );
  });

  it("should return an empty array on API error", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const result = await getImages();
    expect(result).toEqual([]);
  });
});

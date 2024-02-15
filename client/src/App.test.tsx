import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios, { AxiosResponse } from 'axios';
import App from './App';

// Mocking Axios GET request
jest.mock('axios');

describe('App component', () => {
  test('fetches images on mount and renders HomePage with images', async () => {
    // Mock response data
    const mockImages = [
      { id: 1, filename: 'image1.jpg', url: 'http://example.com/image1.jpg', uploadDate: new Date() },
      { id: 2, filename: 'image2.jpg', url: 'http://example.com/image2.jpg', uploadDate: new Date() },
    ];

    // Mock Axios get method with resolved promise
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
      data: mockImages
    } as AxiosResponse<any>);

    // Render the component
    const { getByText } = render(<App />);

    // Wait for images to be fetched
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Check if images are rendered
    expect(getByText('image1.jpg')).toBeInTheDocument();
    expect(getByText('image2.jpg')).toBeInTheDocument();
  });

});

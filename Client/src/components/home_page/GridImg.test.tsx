import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GridImg from './GridImg';
import axios, { AxiosStatic } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

  describe('GridImg Component Integration Test', () => {
    const mockImage = {
      id: 1,
      url: 'http://example.com/image.jpg',
      filename: 'image.jpg',
      uploadDate: new Date('2024-02-17'),
    };

    test('renders image correctly and handles click event', () => {
      const { getByAltText } = render(<GridImg image={mockImage} />);
      
      // Assert that the image is rendered correctly
      const imgElement = getByAltText('Image') as HTMLImageElement;
      expect(imgElement).toBeInTheDocument();
      expect(imgElement.src).toContain('example.jpg');
  
      // Simulate a click event on the image
      fireEvent.click(imgElement);
  
      // Assert that the click event navigates to the correct route (assuming it navigates to /second)
      expect(window.location.pathname).toEqual('/second');
    });
  
    // You can add more integration tests for other functionalities such as handling mouse events, callback function, etc.
  });

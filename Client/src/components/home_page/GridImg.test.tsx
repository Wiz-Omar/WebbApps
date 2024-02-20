import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GridImg from './GridImg';
import axios, { AxiosStatic } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;
// Mock the module where useNavigate is imported from
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

  describe('GridImg Component Integration Test', () => {
    const mockImage = {
      id: 1,
      url: 'http://example.com/image.jpg',
      filename: 'image.jpg',
      uploadDate: new Date('2024-02-17'),
    };

    test('renders image correctly', () => {
      const { getByAltText } = render(<GridImg image={mockImage}  callback={() => {}} />);
      expect(getByAltText('Image')).toBeInTheDocument();
    });

    test('renders image correctly and handles click event', () => {
      const { getByAltText } = render(<GridImg image={mockImage}  callback={() => {}} />);
      
      // Assert that the image is rendered correctly
      const imgElement = getByAltText('Image') as HTMLImageElement;
      expect(imgElement).toBeInTheDocument();
      expect(imgElement.src).toContain('image.jpg');
  
    });

  });

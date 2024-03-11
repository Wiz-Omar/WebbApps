import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GridImg from '../GridImg/GridImg';
import axios, { AxiosStatic } from 'axios';
import { Image } from "../../HomePage";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

// Mock callback function
const mockCallback = jest.fn();

// Mock navigate function
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));
    
const mockImage : Image = {
  id: 1,
  path: 'http://example.com/image.jpg',
  filename: 'image.jpg',
  uploadDate: new Date('2024-02-17'),
};


  describe('GridImg component', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('renders image correctly', () => {
      const { getByTestId } = render(<GridImg image={mockImage}  callback={mockCallback} />);

      // Assert that the image is rendered correctly
      const imgElement = getByTestId('grid-img') as HTMLImageElement;
      expect(imgElement).toBeInTheDocument();
  
    });

    test('handles mouse enter event', async () => {
      const { getByTestId } = render(<GridImg image={mockImage}  callback={mockCallback} />);

      // Assert that the image is rendered correctly
      const imgElement = getByTestId('grid-img') as HTMLImageElement;
      expect(imgElement).toBeInTheDocument();

      fireEvent.mouseOver(imgElement);
      const buttonContainer = await waitFor(() => getByTestId('button-container'));
      expect(buttonContainer).toBeInTheDocument();
  
    });

    test('handles mouse leave event', async () => {
      const { queryByTestId } = render(<GridImg image={mockImage}  callback={mockCallback} />);

      // Assert that the image is rendered correctly
      const imgElement = queryByTestId('grid-img') as HTMLImageElement;
      expect(imgElement).toBeInTheDocument();

      fireEvent.mouseOver(imgElement);
      expect(await waitFor(() => queryByTestId('button-container'))).toBeInTheDocument();
  
      fireEvent.mouseLeave(imgElement);
      expect(await waitFor(() => queryByTestId('button-container'))).not.toBeInTheDocument();
    });

    test('handles mouse click event', async () => {
      const { getByAltText } = render(<GridImg image={mockImage}  callback={mockCallback} />);

      // Assert that the image is rendered correctly
      const image = getByAltText('Image');
      expect(image).toBeInTheDocument();

      fireEvent.click(image);

      expect(mockedUsedNavigate).toHaveBeenCalledWith('/second', { state: { image : mockImage } });  
    });

  });

  
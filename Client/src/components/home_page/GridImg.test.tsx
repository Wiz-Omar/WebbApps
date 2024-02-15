import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GridImg from './GridImg';

jest.mock('axios');

describe('GridImg component', () => {
  const mockImage = {
    id: 1,
    filename: 'image.jpg',
    url: 'http://example.com/image.jpg',
    uploadDate: new Date(),
  };

  test('renders image', () => {
    const { getByAltText } = render(<GridImg image={mockImage} />);
    const imageElement = getByAltText('Image') as HTMLImageElement;
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toBe(mockImage.url);
  });
});

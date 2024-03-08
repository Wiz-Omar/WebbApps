import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SecondPage from './SecondPage';
import { Image } from '../../home_page/HomePage';

describe('SecondPage component', () => {
  test('renders image correctly and toggles full size image on click', () => {
    const testImage: Image = {
      id: 1,
      filename: 'testImage.jpg',
      path: 'testImagePath.jpg',
      uploadDate: new Date(), // Provide a valid date object
    };

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/second', state: { image: testImage, id: 1 } }]}>
        <Routes>
          <Route path="/second" element={<SecondPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the Navbar is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Check if the image is rendered
    const imageElement = screen.getByAltText('Selected');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute('src')).toBe(testImage.path);

    // Check if full size image is initially hidden
    expect(screen.queryByTestId('full-size-image')).not.toBeInTheDocument();

    // Click on the image to toggle full size image
    fireEvent.click(imageElement);

    // Check if full size image is displayed
    expect(screen.getByTestId('full-size-image-container')).toBeInTheDocument();

    // Click on the close button of full size image
    fireEvent.click(screen.getByTestId('close-full-size-image'));

    // Check if full size image is hidden again
    expect(screen.queryByTestId('full-size-image-container')).not.toBeInTheDocument();
  });
});

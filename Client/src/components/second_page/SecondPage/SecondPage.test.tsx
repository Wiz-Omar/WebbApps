import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SecondPage from './SecondPage';
import { Image } from '../../home_page/HomePage';

const testImage: Image = {
  id: 1,
  filename: 'testImage.jpg',
  path: 'testImagePath.jpg',
  uploadDate: new Date(), // Provide a valid date object
};

describe('SecondPage component', () => {
  test('renders Navbar component', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/second', state: { image: testImage, id: 1 } }]}>
        <Routes>
          <Route path="/second" element={<SecondPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('second-navbar')).toBeInTheDocument();
  });

  test('renders image correctly', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/second', state: { image: testImage, id: 1 } }]}>
        <Routes>
          <Route path="/second" element={<SecondPage />} />
        </Routes>
      </MemoryRouter>
    );

    const imageElement = screen.getByAltText('Selected');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.getAttribute('src')).toBe(testImage.path);
  });

  test('toggles full size image on click', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/second', state: { image: testImage, id: 1 } }]}>
        <Routes>
          <Route path="/second" element={<SecondPage />} />
        </Routes>
      </MemoryRouter>
    );

    const imageElement = screen.getByAltText('Selected');

    fireEvent.click(imageElement);
    expect(screen.getByTestId('full-size-image-container')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-full-size-image'));
    expect(screen.queryByTestId('full-size-image-container')).not.toBeInTheDocument();
  });
});

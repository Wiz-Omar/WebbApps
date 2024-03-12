import React from 'react';
import { render, fireEvent, screen, waitFor, getByTestId } from '@testing-library/react';
import axios from 'axios';
import Navbar from './SecondNavbar';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

jest.mock('axios');

describe('Navbar component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

  const mockImage = {
    id: 1,
    filename: 'test-image.png',
    path: 'https://example.com/test-image.png',
    uploadDate: new Date(),
  };

  it('renders navbar', () => {
    render(
        <MemoryRouter initialEntries={[{ pathname: '/second', state: { image: mockImage, id: 1 } }]}>
          <Routes>
            <Route path="/second" element={<Navbar />} />
          </Routes>
        </MemoryRouter>
      );

    // Check if the Navbar is rendered
    expect(screen.getByTestId('second-navbar')).toBeInTheDocument();
  })

  it('renders image filename and buttons', () => {        
    render(
        <MemoryRouter initialEntries={[{ pathname: '/second', state: { image: mockImage, id: 1 } }]}>
          <Routes>
            <Route path="/second" element={<Navbar />} />
          </Routes>
        </MemoryRouter>
      );

    // Check if file name input is rendered with initial filename
    const filenameInput = screen.getByTestId('filename-input');
    expect(filenameInput).toBeInTheDocument();

    // Check if download, delete, and close buttons are rendered
    const downloadButton = screen.getByLabelText('download');
    const deleteButton = screen.getByLabelText('delete');
    const closeButton = screen.getByLabelText('close');
    expect(downloadButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('displays confirmation popup when delete button is clicked', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/second', state: { image: mockImage } }]}>
        <Routes>
          <Route path="/second" element={<Navbar />} />
        </Routes>
      </MemoryRouter>
    );
  
    const deleteButton = screen.getByLabelText('delete');
  
    // Ensure that the confirmation popup is not initially present on the screen
    expect(screen.queryByText('Are you sure you want to delete this image?')).not.toBeInTheDocument();
  
    // Click the delete button
    fireEvent.click(deleteButton);
  
    // Assert that the confirmation popup is now displayed on the screen
    expect(screen.getByText('Are you sure you want to delete this image?')).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import Grid from "./Grid";
import { Image } from "../HomePage";

// Mock useNavigate from 'react-router-dom'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(), // Mocking useNavigate as a jest.fn()
}));

// Mock Image data
const images: Image[] = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  filename: `${i + 1}.png`,
  path: `https://example.com/${i + 1}.png`,
  uploadDate: new Date(),
}));

// Mock callback function
const mockCallback = jest.fn();

describe('Grid component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders without crashing', () => {
    render(<Grid images={images} callback={mockCallback} />);
  });

  it('renders GridImg component for each image', () => {
    const { getAllByTestId } = render(<Grid images={images} callback={mockCallback} />);
    const gridImages = getAllByTestId('grid-img');
    expect(gridImages.length).toBe(images.length);
  });

  it('renders NoImagesDisplay component when no images are provided', () => {
    const { getByTestId } = render(<Grid images={[]} callback={mockCallback} />);
    const noImagesDisplay = getByTestId('no-images-display');
    expect(noImagesDisplay).toBeInTheDocument();
  });
});
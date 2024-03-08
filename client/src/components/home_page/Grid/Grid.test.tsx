import React from "react";
import { render, screen } from "@testing-library/react";
import Grid from "./Grid";
import { Image } from "../HomePage";

// Mock useNavigate from 'react-router-dom'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(), // Mocking useNavigate as a jest.fn()
}));

// Mock GridImg
/* jest.mock('./GridImg/GridImg', () => ({
  __esModule: true,
  default: jest.fn(() => null), // Mock GridImg as a functional component that renders nothing
})); */

jest.mock("./GridImg/GridImg", () => {
  return ({ image }: { image: Image }) => (
    <div data-testid="grid-img">{image.path}</div>
  );
});

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


//TODO: change this later!
/* jest.mock("./GridImg", () => {
  return ({ image }: { image: Image }) => (
    <div data-testid={`grid-img-${image.id}`}>{image.path}</div>
  );
});

describe("Grid component", () => {
  it("renders correctly with no images", () => {
    const images: Image[] = [];
    render(<Grid images={images} callback={() => {}}/>);
    const noImagesMessage = screen.getByTestId("no-images-message");
    expect(noImagesMessage).toBeInTheDocument();
  });

  it("always renders three columns if images not empty", () => {
    // Create an array of 3 images
    const images: Image[] = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      filename: `${i + 1}.png`,
      path: `https://example.com/${i + 1}.png`,
      uploadDate: new Date(),
    }));
    const { container } = render(<Grid images={images} callback={() => {}}/>);
    const columns = container.querySelectorAll(".col-md-4"); // Assuming you're using Bootstrap or similar for columns
    expect(columns.length).toBe(3);
  });

  [1, 2, 4, 5].forEach((count) => {
    it(`distributes ${count} image(s) evenly across columns`, () => {
      const images: Image[] = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        filename: `${i + 1}.png`,
        path: `https://example.com/${i + 1}.png`,
        uploadDate: new Date(),
      }));

      render(<Grid images={images} callback={() => {}}/>);
      images.forEach((image) => {
        const renderedImage = screen.getByTestId(`grid-img-${image.id}`);
        expect(renderedImage).toHaveTextContent(image.path);
      });
    });
  });
}); */
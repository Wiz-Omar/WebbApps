import React from "react";
import { render, screen } from "@testing-library/react";
import Grid from "./Grid";
import { Image } from "../HomePage";

//TODO: change this later!
jest.mock("./GridImg", () => {
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
});

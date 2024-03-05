import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from 'axios';
import SearchBar from "./SearchBar";
import { Image } from "../../home_page/HomePage";

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe("SearchBar component", () => {
  test("renders the searchbar initially", () => {
    render(<SearchBar />);
    const searchBar = screen.getByPlaceholderText("Search in Storage");
    expect(searchBar).toBeInTheDocument();
  });

  test("changes search query on user input", () => {
    render(<SearchBar />);
    const searchBar: HTMLInputElement = screen.getByPlaceholderText("Search in Storage");
    fireEvent.change(searchBar, { target: { value: 'test' } });
    expect(searchBar.value).toBe('test');
  });

  test("performs search when input is not empty", async () => {
    const images: Image[] = [{
      id: 1,
      filename: 'test.png',
      path: 'https://example.com/test.png',
      uploadDate: new Date('2024-03-05'),
    }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: images });

    render(<SearchBar />);
    const searchBar = screen.getByPlaceholderText("Search in Storage");
    fireEvent.change(searchBar, { target: { value: 'test' } });
    fireEvent.focus(searchBar);

    await screen.findByAltText('test.png');
  });

  test("clears search results when input is empty", async () => {
    const images: Image[] = [{
      id: 1,
      filename: 'test.png',
      path: 'https://example.com/test.png',
      uploadDate: new Date(),
    }];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: images });

    render(<SearchBar />);
    const searchBar = screen.getByPlaceholderText("Search in Storage");
    fireEvent.change(searchBar, { target: { value: 'test' } });
    fireEvent.focus(searchBar);

    await screen.findByAltText('test.png');

    fireEvent.change(searchBar, { target: { value: '' } });
    fireEvent.blur(searchBar);

    expect(screen.queryByText('test.png')).not.toBeInTheDocument();
  });
});
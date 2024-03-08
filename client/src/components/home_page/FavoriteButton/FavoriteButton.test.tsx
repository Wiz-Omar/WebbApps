import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<FavoriteButton isLiked={false} callback={() => {}} />);
    const favoriteButton = getByTestId('favorite-button');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('calls the callback function when clicked', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = render(<FavoriteButton isLiked={false} callback={mockCallback} />);
    const favoriteButton = getByTestId('favorite-button');
    fireEvent.click(favoriteButton);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('renders a filled heart icon when isLiked is true', () => {
    const { container } = render(<FavoriteButton isLiked={true} callback={() => {}} />);
    const heartFillIcon = container.querySelector('.button svg[fill="red"]');
    expect(heartFillIcon).toBeInTheDocument();
  });

  it('renders an outline heart icon when isLiked is false', () => {
    const { container } = render(<FavoriteButton isLiked={false} callback={() => {}} />);
    const heartIcon = container.querySelector('.button svg:not([fill="red"])');
    expect(heartIcon).toBeInTheDocument();
  });
});

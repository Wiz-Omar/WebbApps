import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton component', () => {

  test('renders unfilled heart icon when not liked', () => {
    const { container } = render(<FavoriteButton isLiked={false} callback={() => {}} />);
    const unfilledHeartIcon = container.querySelector('.bi.bi-heart');
    expect(unfilledHeartIcon).toBeInTheDocument();
  });

  test('renders filled heart icon when liked', () => {
    const { container } = render(<FavoriteButton isLiked={true} callback={() => {}} />);
    const filledHeartIcon = container.querySelector('.bi.bi-heart-fill');
    expect(filledHeartIcon).toBeInTheDocument();
  });
  
  test('calls callback function when clicked', () => {
    const mockCallback = jest.fn();
    const { container } = render(<FavoriteButton isLiked={false} callback={mockCallback} />);
    const favoriteButton = container.querySelector('.button') as HTMLElement;
    fireEvent.click(favoriteButton);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
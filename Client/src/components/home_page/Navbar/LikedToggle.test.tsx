import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import LikedToggle from './LikedToggle';

// Mock callback function
const mockCallback = jest.fn();

describe('LikedToggle Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
      
  it('renders correctly', () => {
    const { getByText } = render(<LikedToggle onToggle={mockCallback} />);
    expect(getByText('Showing All Images')).toBeInTheDocument();
  });

  it('toggles to show liked images when clicked once', () => {
    const { getByText, getByTestId } = render(<LikedToggle onToggle={mockCallback} />);
    
    fireEvent.click(getByTestId('liked-toggle'));
    expect(getByText('Showing Liked Images')).toBeInTheDocument();
    expect(mockCallback).toHaveBeenCalledWith(undefined, undefined, true);
  });

  it('toggles to show all images when clicked twice', () => {
    const { getByText, getByTestId } = render(<LikedToggle onToggle={mockCallback} />);
    
    fireEvent.click(getByTestId('liked-toggle'));
    expect(mockCallback).not.toHaveBeenCalledWith(undefined, undefined, false);
    
    fireEvent.click(getByTestId('liked-toggle'));
    expect(mockCallback).toHaveBeenCalledWith(undefined, undefined, false);
    expect(getByText('Showing All Images')).toBeInTheDocument();
  });
});

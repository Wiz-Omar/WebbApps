import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import LikedToggle from './LikedToggle';

describe('LikedToggle Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
      });
      
  it('renders correctly', () => {
    const { getByText } = render(<LikedToggle onToggle={() => {}} />);
    expect(getByText('Showing All Images')).toBeInTheDocument();
  });

  it('toggles to show liked images when clicked', () => {
    const mockCallback = jest.fn();
    const { getByText } = render(<LikedToggle onToggle={mockCallback} />);
    
    act(() => {
      fireEvent.click(getByText('Showing All Images'));
    });
    expect(mockCallback).toHaveBeenCalledWith(undefined, undefined, true);
  });

  it('toggles to show all images when clicked again', () => {
    const mockCallback = jest.fn();
    const { getByText } = render(<LikedToggle onToggle={mockCallback} />);
    
    act(() => {
      fireEvent.click(getByText('Showing All Images'));
    });
    expect(mockCallback).not.toHaveBeenCalledWith(undefined, undefined, false);
    act(() => {
        fireEvent.click(getByText('Showing Liked Images'));
      });    
    expect(mockCallback).toHaveBeenCalledWith(undefined, undefined, false);
  });
});

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import SortDropdown from './SortDropdown';

describe('SortDropdown Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SortDropdown callback={() => {}} />);
    expect(getByText('Sort by')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    const { getByText, getByTestId } = render(<SortDropdown callback={() => {}} />);
    act(() => {
      fireEvent.click(getByText('Sort by'));
    });
    expect(getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('closes dropdown after selecting an option', () => {
    const { getByText, queryByTestId } = render(<SortDropdown callback={() => {}} />);
    act(() => {
      fireEvent.click(getByText('Sort by'));
    });
    act(() => {
        fireEvent.click(getByText('Sort by upload date (newest first)'));
      });    expect(queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('calls callback function with correct parameters when an option is selected', () => {
    const mockCallback = jest.fn();
    const { getByText } = render(<SortDropdown callback={mockCallback} />);
    act(() => {
      fireEvent.click(getByText('Sort by'));
    });
    act(() => {
        fireEvent.click(getByText('Sort by upload date (newest first)'));
    });
    expect(mockCallback).toHaveBeenCalledWith('uploadDate', 'desc');
  });
});

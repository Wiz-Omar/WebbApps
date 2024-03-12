import React from 'react';
import { render, fireEvent, act, getByTestId, waitFor, getByText } from '@testing-library/react';
import SortDropdown from './SortDropdown';

// Mock callback function
const mockCallback = jest.fn();

describe('SortDropdown Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly', () => {
    const { getByTestId } = render(<SortDropdown callback={mockCallback} />);
    expect(getByTestId('dropdown-button')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const { getByTestId, getByText } = render(<SortDropdown callback={mockCallback} />);

    act(() => {
      fireEvent.click(getByText('Sort by'));
    });

    expect(await waitFor(() => getByTestId('dropdown-menu'))).toBeInTheDocument();
  });

  it('closes dropdown after selecting an option', async () => {
    const { getByTestId, queryByTestId, getByText } = render(<SortDropdown callback={mockCallback} />);
    
    act(() => {
      fireEvent.click(getByText('Sort by'));
    });
    act(() => {
      fireEvent.click(getByTestId('sort-upload-desc'));
    });

    expect(await waitFor(() => queryByTestId('dropdown-menu'))).not.toBeInTheDocument();
  });

  it('calls callback function with correct parameters when an option is selected', async () => {
    const { getByText, getByTestId } = render(<SortDropdown callback={mockCallback} />);
    
    act(() => {
      fireEvent.click(getByText('Sort by'));
    });
    act(() => {
      fireEvent.click(getByTestId('sort-upload-desc'));
    });

    expect(mockCallback).toHaveBeenCalledWith('uploadDate', 'desc');
  });
});

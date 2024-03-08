import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

const SORT_BY_UPLOAD_DATE_DESC = "Sort by upload date (newest first)";
const SORT_BY_UPLOAD_DATE_ASC = "Sort by upload date (oldest first)";
const SORT_BY_FILENAME_ASC = "Sort by file name (A-Z)";
const SORT_BY_FILENAME_DESC = "Sort by file name (Z-A)";

interface SortDropdownProps {
  callback: (sortField?: string, sortOrder?: string) => void;
}

/**
 * A dropdown button that allows the user to sort images by different criteria.
 * 
 * Props:
 * - `callback` (function): A callback function that is called when the user selects a sorting option. It should accept
 *  two optional parameters: `sortField` (string) and `sortOrder` (string).
 */
const SortDropdown: React.FC<SortDropdownProps> = ({ callback }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSort = (sortField: string, sortOrder: string) => {
    callback(sortField, sortOrder);
    setIsOpen(false); // Close the dropdown after selecting an option
  };

  return (
    <DropdownButton
      id="dropdown-basic-button"
      title="Sort by"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen && (
        <div>
          <Dropdown.Item onClick={() => handleSort('uploadDate', 'desc')}> {SORT_BY_UPLOAD_DATE_DESC} </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort('uploadDate', 'asc')}> {SORT_BY_UPLOAD_DATE_ASC} </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort('filename', 'asc')}> {SORT_BY_FILENAME_ASC} </Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort('filename', 'desc')}> {SORT_BY_FILENAME_DESC} </Dropdown.Item>
        </div>
      )}
    </DropdownButton>
  );
};

export default SortDropdown;

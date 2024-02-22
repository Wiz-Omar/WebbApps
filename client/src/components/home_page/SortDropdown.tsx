import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

interface SortDropdownProps {
  callback: (sortField?: string, sortOrder?: string) => void;
}

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
        // TODO: break out to Component:
        <div>
          <Dropdown.Item href="#/action-1" onClick={() => handleSort('uploadDate', 'desc')}>Sort by upload date (newest first)</Dropdown.Item>
          <Dropdown.Item href="#/action-1" onClick={() => handleSort('uploadDate', 'asc')}>Sort by upload date (oldest first)</Dropdown.Item>
          <Dropdown.Item href="#/action-1" onClick={() => handleSort('filename', 'asc')}>Sort by file name (A-Z)</Dropdown.Item>
          <Dropdown.Item href="#/action-1" onClick={() => handleSort('filename', 'desc')}>Sort by file name (Z-A)</Dropdown.Item>

        </div>
      )}
    </DropdownButton>
  );
};

export default SortDropdown;

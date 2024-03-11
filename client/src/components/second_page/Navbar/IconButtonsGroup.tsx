// IconButtonsGroup.tsx
import React, { FC } from 'react';
import IconButton from "../../common/IconButton/IconButton";
import DeleteIcon from "./DeleteIcon";
import DownloadIcon from "./DownloadIcon";
import CloseIcon from "./CloseIcon";

interface IconButtonsGroupProps {
    onDownload: () => void;
    onDelete: () => void;
    onClose: () => void;
}

/**
 * IconButtonsGroup component. A group of icon buttons for download, delete and close.
 * 
 * Props:
 * - onDownload: () => void - The function to call when the download button is clicked
 * - onDelete: () => void - The function to call when the delete button is clicked
 * - onClose: () => void - The function to call when the close button is clicked
 */
const IconButtonsGroup: FC<IconButtonsGroupProps> = ({ onDownload, onDelete, onClose }) => {
    return (
        <div className="icon-buttons-container d-flex align-items-center">
            <IconButton Icon={DeleteIcon} ariaLabel="delete" onClick={onDelete} />
            <IconButton Icon={DownloadIcon} ariaLabel="download" onClick={onDownload} />
            <IconButton Icon={CloseIcon} ariaLabel="close" onClick={onClose} />
        </div>
    );
};

export default IconButtonsGroup;

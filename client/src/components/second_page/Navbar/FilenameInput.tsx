// FilenameInput.tsx
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface FilenameInputProps {
    initialFilename: string;
    fileExtension: string;
    onRename: (filename: string, fileExtension: string) => Promise<void>;
}

/**
 * FilenameInput component. An input for renaming a file. 
 * It calls the onRename function when the file is renamed.
 * 
 * Props:
 * - initialFilename: string - The initial filename
 * - fileExtension: string - The file extension
 * - onRename: (filename: string, fileExtension: string) => Promise<void> - The function to call when the file is renamed
 */
const FilenameInput: React.FC<FilenameInputProps> = ({ initialFilename, fileExtension, onRename }) => {
    const [filename, setFilename] = useState(initialFilename);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Only set width if the filename is short enough
        if (filename.length <= 30) {
            inputRef.current!.style.width = `${filename.length + 1}ch`;
        } else {
            inputRef.current!.style.width = '30ch'; // Set a fixed width for longer filenames
        }
    }, [filename]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.replace(/[^a-zA-Z0-9-. ]/g, '');
        setFilename(input);
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            await onRename(filename, fileExtension);
            inputRef.current?.blur();
        }
    };

    return (
        <div className="file-info-container" data-testid="filename-input"> 
            <h1 className="mb-0">
                <span className="file-label">Filename:</span>{" "}
                <input
                    ref={inputRef}
                    type="text"
                    className="file-name-input"
                    value={filename}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    title="Only letters, numbers, hyphens, dots, and spaces are allowed"
                />
            </h1>
        </div>
    );
};

export default FilenameInput;

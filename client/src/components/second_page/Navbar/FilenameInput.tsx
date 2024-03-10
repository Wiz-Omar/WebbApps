// FilenameInput.tsx
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';

interface FilenameInputProps {
    initialFilename: string;
    fileExtension: string;
    onRename: (filename: string, fileExtension: string) => Promise<void>;
}

const FilenameInput: React.FC<FilenameInputProps> = ({ initialFilename, fileExtension, onRename }) => {
    const [filename, setFilename] = useState(initialFilename);
    const inputRef = useRef<HTMLInputElement>(null);

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
        <input
            ref={inputRef}
            type="text"
            className="file-name-input"
            value={filename}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            pattern="[a-zA-Z]+"
            title="Only letters, numbers, hyphens, dots, and spaces are allowed"
        />
    );
};

export default FilenameInput;

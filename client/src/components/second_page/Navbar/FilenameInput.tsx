// FilenameInput.tsx
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { handleChangeName } from "../../../utils/handleChangeName";
import { Image } from "../../home_page/HomePage";

interface UploadButtonProps {
    image: Image;
}

/**
 * FilenameInput component. An input for renaming a file. 
 * It calls the handleRename function when the file is renamed.
 * 
 * Props:
 * - initialFilename: string - The initial filename
 * - fileExtension: string - The file extension
 * - handleRename: (filename: string, fileExtension: string) => Promise<void> - The function to call when the file is renamed
 */
const FilenameInput: React.FC<UploadButtonProps> = ({ image }) => {
    const filenameParts = image.filename.split(".");
    const initialFilename = filenameParts.slice(0, -1).join("."); // Join all parts except the last one
    const fileExtension = filenameParts.pop() as string;

    const [filename, setFilename] = useState(initialFilename); // Stores the edited string
    const [currentFilename, setCurrentFilename] = useState(initialFilename); // Stores last saved filename
    const inputRef = useRef<HTMLInputElement>(null);
    const [handleRenameOnEnter, setHandleRenameOnEnter] = useState(false);

    // let [newFilename, setNewFilename] = useState(initialFilename);

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
            setHandleRenameOnEnter(true);
            await handleRename(filename, fileExtension);
            inputRef.current?.blur();
        }
    };

    async function handleBlur(): Promise<void> {
        if (!handleRenameOnEnter) {
            await handleRename(filename, fileExtension);
        }
        setHandleRenameOnEnter(false);
    }

    function resetFilename() : void {
        setFilename(currentFilename);
    }

    // Event handler for the rename input
    const handleRename = async (filename: string, fileExtension: string) => {
        try {
            if (filename !== currentFilename) {
                // New filename is not equal to initial filename
                await handleChangeName(image.id, filename, fileExtension);
                setFilename(filename);
                setCurrentFilename(filename);
            }
        } catch (error: any) {
            // Axios error response
            if (error.response) {
                // Revert to original filename
                setFilename(currentFilename);

                // Alert the user what went wrong
                switch (error.response.status) {
                    case 401:
                        alert("Unauthorized: User is not logged in.");
                        break;
                    case 404:
                        alert("Image not found.");
                        break;
                    case 409:
                        alert("Image filename not available.");
                        break;
                    case 500:
                        alert("Internal server error: Failed to rename the image.");
                        break;
                    default:
                        alert("Something went wrong.");
                }
            } else {
                alert("Something went wrong.");
            }
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
                    onBlur={handleBlur}
                    title="Only letters, numbers, hyphens, dots, and spaces are allowed"
                />
            </h1>
        </div>
    );
};

export default FilenameInput;

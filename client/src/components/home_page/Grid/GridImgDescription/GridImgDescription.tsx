import React from "react";

import "./GridImgDescription.css";

// Adjust maxLength as needed
const MAX_LENGTH = 20;

interface GridImgDescriptionProps {
  child: string;
}

/**
 * GridImgDescription component. A description for the image in the grid.
 * Ensures the description is not too long and fits within the grid item.
 * Uses text-overflow: ellipsis to truncate the text if it is too long to fit.
 *
 * Props:
 * - child: string - The description to display
 */
const GridImgDescription = ({ child }: GridImgDescriptionProps) => {
  const truncateText = (text: string, maxLength: number) => {
    // Regular expression to match file extension like .jpg, .jpeg, .png, etc.
    const extensionMatch = text.match(/\.[0-9a-z]+$/i);
    const extension = extensionMatch ? extensionMatch[0] : "";

    // Reduce the maxLength by the length of the extension
    maxLength -= extension.length;

    // Ensure we have space for at least the start of the filename and the ellipsis
    if (maxLength < 1) maxLength = 1;

    if (text.length <= maxLength + extension.length) {
      return text;
    }

    let truncated = text.slice(0, maxLength);

    // If the character at the cut-off point is a hyphen, we include it in the truncated text
    if (text[maxLength] === "-") {
      truncated += "-";
    }

    // Return the truncated text with an ellipsis and the original file extension
    return `${truncated}...${extension}`;
  };

  const displayedText = truncateText(child, MAX_LENGTH);

  return (
    <div
      className="grid-img-description"
      style={{
        position: "absolute",
        left: 5,
        bottom: 5,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: "0.8rem",
      }}
    >
      {displayedText}
    </div>
  );
};

export default GridImgDescription;

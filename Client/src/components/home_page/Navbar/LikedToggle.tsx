import React, { useState } from 'react';

interface LikedToggleProps {
  onToggle: (sortField?: string, sortOrder?: string, onlyLiked?: boolean) => void;
}

const SHOW_ALL_LABEL = 'Showing All Images';
const SHOW_LIKED_LABEL = 'Showing Liked Images';

/**
 * A button that toggles between showing all images and showing only liked images.
 * 
 * Props:
 * - `onToggle` (function): A callback function that is called when the toggle button is clicked. It should accept
 *   three optional parameters: `sortField` (string), `sortOrder` (string), and `onlyLiked` (boolean).
 * 
 */
function LikedToggle({ onToggle: callback }: LikedToggleProps) {
  const [onlyLiked, setOnlyLiked] = useState(false);

  const handleToggle = () => {
    const newOnlyLikedState = !onlyLiked;
    setOnlyLiked(newOnlyLikedState);
    // Directly call the callback with the new onlyLiked state
    callback(undefined, undefined, newOnlyLikedState);
  };

  return (
    <button className="btn btn-outline-primary mx-2" onClick={handleToggle}>
      {onlyLiked ? SHOW_LIKED_LABEL : SHOW_ALL_LABEL}
    </button>
  );
};

export default LikedToggle;

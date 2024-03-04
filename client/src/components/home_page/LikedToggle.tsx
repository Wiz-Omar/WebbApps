import React, { useState } from 'react';

interface LikedToggleProps {
  callback: (sortField?: string, sortOrder?: string, onlyLiked?: boolean) => void;
}

function LikedToggle({ callback }: LikedToggleProps) {
  const [onlyLiked, setOnlyLiked] = useState(false);

  const handleToggle = () => {
    const newOnlyLikedState = !onlyLiked;
    setOnlyLiked(newOnlyLikedState);
    // Directly call the callback with the new onlyLiked state
    callback(undefined, undefined, newOnlyLikedState);
  };

  return (
    <button className="btn btn-outline-primary ms-2" onClick={handleToggle}>
      {onlyLiked ? 'Showing Liked Images' : 'Showing All Images'}
    </button>
  );
};

export default LikedToggle;

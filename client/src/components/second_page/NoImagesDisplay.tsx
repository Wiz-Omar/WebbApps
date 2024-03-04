// NoImagesDisplay.jsx

import React from 'react';
import UploadButton from '../home_page/UploadButton'; // Import your UploadButton component
import { ReactComponent as EmptyStateIllustration } from './empty-state-illustration.svg';
import './NoImagesDisplay.css'; // Assuming your styling is in this CSS file

interface NoImagesDisplayProps {
    updateScreen: () => void;
}

const NoImagesDisplay = ({ updateScreen } : NoImagesDisplayProps) => {
  return (
    <div className="no-images-container">
      <div className="no-images-content">
        <h2>No images to display.</h2>
        <p>Get started by uploading your first image.</p>
        {/* Integrate the UploadButton component and pass updateScreen as the callback */}
        <UploadButton callback={updateScreen} />
      </div>
    </div>
  );
};

export default NoImagesDisplay;

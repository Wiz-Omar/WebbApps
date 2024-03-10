import './NoImagesDisplay.css'; // Assuming your styling is in this CSS file

/**
 * A component that displays a message when there are no images to display.
 */
const NoImagesDisplay = () => {
  return (
    <div className="no-images-container" data-testid="no-images-display"> 
      <div className="no-images-content">
        <h2>No images to display here!</h2>
      </div>
    </div>
  );
};

export default NoImagesDisplay;

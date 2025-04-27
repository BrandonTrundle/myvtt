/**
 * Author: Brandon Trundle
 * File Name: CharacterPortrait.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides functionality for users to upload and resize a character portrait image.
 * Ensures all portraits are resized and centered into a 256x256 pixel canvas before being stored.
 */

import { useRef } from 'react'; // React hook for accessing and manipulating the DOM (canvas element)


/**
 * CharacterPortrait Component
 * 
 * Purpose:
 * Allows users to upload a character portrait and automatically resizes the image to a standard size for consistency.
 * 
 * Props:
 * @param {string} imageSrc - The current base64-encoded image source to display in the preview.
 * @param {Function} setImageSrc - Function to update the image source after resizing.
 * 
 * Behavior:
 * - Displays an existing portrait if available, or a placeholder prompting for upload.
 * - When an image is uploaded, draws it into a hidden canvas resized to 256x256 pixels.
 * - Converts the canvas to a base64 PNG and updates the parent component state.
 */
const CharacterPortrait = ({ imageSrc, setImageSrc }) => {
  const canvasRef = useRef(null);
  
/**
 * Handles reading and resizing an uploaded image file before updating the portrait source.
 */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const targetSize = 256;
        canvas.width = targetSize;
        canvas.height = targetSize;

        // Clear canvas
        ctx.clearRect(0, 0, targetSize, targetSize);

        // Calculate scaled dimensions
        const ratio = Math.min(targetSize / img.width, targetSize / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        const offsetX = (targetSize - newWidth) / 2;
        const offsetY = (targetSize - newHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        const resizedDataUrl = canvas.toDataURL('image/png');
        setImageSrc(resizedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="portrait-container">
      <div className="portrait-preview">
        {imageSrc ? (
          <img src={imageSrc} alt="Character Portrait" className="portrait-image" />
        ) : (
          <div className="portrait-placeholder">Upload Image</div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="portrait-input"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CharacterPortrait;

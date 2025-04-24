// CharacterPortrait.jsx

import { useRef } from 'react';

const CharacterPortrait = ({ imageSrc, setImageSrc }) => {
  const canvasRef = useRef(null);

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

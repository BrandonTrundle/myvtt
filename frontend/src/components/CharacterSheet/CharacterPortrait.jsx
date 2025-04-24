const CharacterPortrait = ({ imageSrc, setImageSrc }) => {
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImageSrc(e.target.result);
        reader.readAsDataURL(file);
      }
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
      </div>
    );
  };
  
  export default CharacterPortrait;
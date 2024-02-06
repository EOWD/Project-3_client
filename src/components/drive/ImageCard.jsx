import React from 'react';
import "./ImageCard.css"

const ImageCard = ({ userId, imageName, prompt, imageUrl, id }) => {

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: imageName,
        text: prompt,
        url: imageUrl,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${imageName}.png`; // or any other extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='generateImage-wrapper'>
      <div className='generateImage-data'>
        <div className='contentBelowImage' style={{ marginTop: '10px' }}>
          <div className="imageNameAndShare">
            <h3>{imageName}</h3>
            <button onClick={handleShare}>Share</button>
            <button onClick={handleDownload}>Download</button>
          </div>
          {/* <div className="imagePrompt">{prompt}</div> */}
        </div>
        <img className='topImage' src={imageUrl} alt={imageName} style={{ marginTop: '10px' }} id={id} />
        <div className="bluredImageBelow">
        <img src={imageUrl} alt={imageName} style={{ maxWidth: '65%', marginTop: '10px' }} />
        </div>
      </div>
    </div>
  );
};

export default ImageCard;

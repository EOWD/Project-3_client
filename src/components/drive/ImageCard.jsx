import React from 'react';

const ImageCard = ({ userId, imageName, prompt, imageUrl }) => {

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
    <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
      <div><strong>User ID:</strong> {userId}</div>
      <div><strong>Name:</strong> {imageName}</div>
      <div><strong>Prompt:</strong> {prompt}</div>
     {imageUrl && <img src={imageUrl} alt={imageName} style={{ maxWidth: '100%', marginTop: '10px' }} />}
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleShare}>Share</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default ImageCard;

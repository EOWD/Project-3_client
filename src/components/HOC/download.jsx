// useImageDownloader.js
import { Cloudinary } from "@cloudinary/url-gen";

const useImageDownloader = () => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_NAME
    }
  });

  const handleDownload = (publicId, fileName) => {
    // Construct the download URL with the attachment delivery type
    const imageUrl = cld.image(publicId).deliveryType('attachment').toURL();

    // Dynamically create an anchor tag to trigger the download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName; // This attribute suggests a filename to save as
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return handleDownload;
};

export default useImageDownloader;

import React, { useState, useContext,useEffect } from "react";
import { UserDataContext } from "../../../context/UserDataContext";
import "./Images.css";
import { Trash2, Minimize2, Share2, DownloadCloud } from 'lucide-react';
import { Link, NavLink } from "react-router-dom";

function Images() {
    const { images,refreshData } = useContext(UserDataContext);
    console.log(images)
    const [selectedImage, setSelectedImage] = useState(null);
   // useEffect(()=>{refreshData()},[])
    // Function to view single image
    function viewSingleImage(imageData) {
        setSelectedImage(imageData);
    }

    /* const handleShare = (imageName, imageUrl) => {
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

    const handleDownload = (imageName, imageUrl) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${imageName}.png`; // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }; */

    return (
        <div className="outerContainer">
            <div className={selectedImage ? "allImages-container selected" : "allImages-container"}>
                {images.map((image) => (
                    <div key={image._id} className="imageContainer">
                        <img
                            className="image"
                            onClick={() => viewSingleImage(`data:image/jpeg;base64,${image.imageData}`)}
                            src={`data:image/jpeg;base64,${image.imageData}`}
                            alt={image.name}
                        />
                    </div>
                ))}
            </div>
            <div className={selectedImage ? "viewSingleImage-container selected" : "viewSingleImage-container"}>
                <div>{selectedImage && <img src={selectedImage} alt="Selected" />}</div>
                <div>{selectedImage && <img className="blurBG" src={selectedImage} alt="Selected" />}</div>
                <div className="actionButtons">
                    <Minimize2 color="gray" className="closeSingleView" onClick={()=>setSelectedImage(null)} />
                    <div>
                        <DownloadCloud color="gray" />
                        <Share2 onClick={()=>handleShare} color="gray" />
                        <Trash2 color="gray" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Images;

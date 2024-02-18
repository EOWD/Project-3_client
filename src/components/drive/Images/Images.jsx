import React, { useState, useContext,useEffect } from "react";
import { UserDataContext } from "../../../context/UserDataContext";
import "./Images.css";
import { Trash2, Minimize2, Share2, DownloadCloud } from 'lucide-react';
import axios from "axios";
import { Modal, Button, Checkbox } from 'rsuite';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function Images() {
    const { images, selectedImage, refreshData } = useContext(UserDataContext);
    const [bigImage, setBigImage] = useState(null);
    const [bigImageName, setBigImageName] = useState(null)
    const [bigImageId, setbigImageId] = useState(null)
    const [bigImageShare, setbigImageShare] = useState(null)
    const [imagePId, setbigImagePId] = useState(null)

    
    
    const [toggleShareState, setToggleShareState] = useState(null)

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const API_URL = import.meta.env.VITE_APP_SERVER;

    useEffect(() => {
        if(selectedImage && selectedImage.imageData){
            setBigImage(selectedImage.url);
            setBigImageName(selectedImage.name)
            setbigImageId(selectedImage._id)
            setbigImageShare(selectedImage.share)
            setbigImagePId(selectedImage.public_id)
        }
    }, [selectedImage]);

    // Function to view single image
    function viewSingleImage(imageData) {
        console.log(imagePId);
        setBigImage(imageData);
    }

    const handleDownload = (imageName, imageUrl,id) => {
        const encodedImageName = encodeURIComponent(imageName); // Ensure imageName is URL-safe
        const downloadUrl = `https://res.cloudinary.com/djbugpgz9/image/upload/fl_attachment/${id}.png`;

        const link = document.createElement('a');
        link.href = downloadUrl;
      
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    async function deleteThisImage(imageId){
        try {
            const response = await axios.post(API_URL+"/drive/user/images/delete",{imageId})
            await refreshData()
            setBigImage(null)
            /* console.log(response) */
        } catch (error) {
            console.log(error)
        }
    }

    async function toggleShare(){
        try {
            let share
            if(toggleShareState === true){
                share = "true"
            } else {
                share = "false"
            }
            const response = await axios.post(API_URL+"/drive/image/share",{share: share, imageId: bigImageId})
            await refreshData()
            setbigImageShare(toggleShareState)
            /* console.log(response) */
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="outerContainer">
            <div className={bigImage ? "allImages-container selected" : "allImages-container"}>
            {
                images.length < 1 ? (
                    Array.from({ length: 21 }).map((_, index) => ( // Adjust length as needed
                        <div key={index} className="imageContainer">
                            <Skeleton height={200} width={200} /> {/* Adjust size as needed */}
                        </div>
                    ))
                ) : (
                    [...images].reverse().map((image) => (
                        <div key={image._id} className="imageContainer">
                            <img
                                className="image"
                                onClick={() => {viewSingleImage(image.url); setBigImageName(image.name); setbigImageId(image._id); setbigImageShare(image.share);setbigImagePId(image.public_id)}}
                                src={image.url}
                                alt={image.name}
                            />
                        </div>
                    ))
                )
            }
            </div>
            <div className={bigImage ? "viewSingleImage-container selected" : "viewSingleImage-container"}>
                <div>{bigImage && <img src={bigImage} alt="Selected" />}</div>
                <div>{bigImage && <img className="blurBG" src={bigImage} alt="Selected" />}</div>
                <div className="actionButtons">
                    <Minimize2 color="gray" className="closeSingleView" onClick={()=>setBigImage(null)} />
                    <div>
                        <DownloadCloud onClick={() => {handleDownload(bigImageName, bigImage,imagePId)}} color="gray" />
                        <Share2 onClick={()=>{handleOpen()}} color="gray" />
                        <Trash2 onClick={()=>{deleteThisImage(bigImageId)}} color="gray" />
                    </div>
                </div>
            </div>

            <Modal size={400} open={open} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Publish the image on the Marketplace</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <br />
                    <Checkbox onChange={()=>{setToggleShareState(!bigImageShare)}} {...(bigImageShare ? { defaultChecked: true } : {})}> Publish</Checkbox>
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={()=>{handleClose(); toggleShare()}} appearance="primary">
                    Ok
                </Button>   
                <Button onClick={handleClose} appearance="subtle">
                    Cancel
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Images;

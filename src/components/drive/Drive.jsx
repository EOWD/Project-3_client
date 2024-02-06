import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import Explore from "./Explore";
import UserImages from "./driveRenders/UserImages";
import { UserDataContext } from "../../context/UserDataContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ImageCard from "./ImageCard";
import "./Drive.css"

function Drive() {

  const { images } = useContext(UserDataContext);
  const location = useLocation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (images.length) {
      const id = location.hash.replace('#', '');
      
      // Adding a timeout
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log("SHOULD SCROLL");
        }
      }, 10); // Timeout of 100ms
    }
  }, [images.length, location.hash]);

  useEffect(() => {
    setItems(images); // Update items whenever images changes
  }, [images]);

  return (
    <div>
      <h2>DRIVE</h2>

      <Swiper
      slidesPerView={2}
      className="imageSwiper"
    >
      
      {items.map((one) => (
        <SwiperSlide key={one.imageName}>
          <ImageCard
            key={one.imageName}
            id={one._id}
            imageName={one.imageName}
            prompt={one.prompt}
            imageUrl={`data:image/png;base64,${one.imageData}`}
            className="swiperSlide"
          />
        </SwiperSlide>
      ))}
    </Swiper>

      {/* <UserImages /> */}
    </div>
  );
}

export default Drive;

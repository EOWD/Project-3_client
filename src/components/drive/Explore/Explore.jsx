import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import ImageCard from "../ImageCard";
import LoadingSpinner from "../../layout/loadingSpinne/LoadingSpinner";
import "./Explorer.css";

function Explore() {
  const server = import.meta.env.VITE_APP_SERVER;
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use user.id directly in your request
        const images = await axios.post(`${server}/drive/user/images`, {
          id: user.id,
        });
        let unfilteredImages = images.data.data
        setItems(unfilteredImages.filter(one => one.share === true));
      } catch (error) {
        console.log(error);
      }
    };

    // Call fetchData only if user.id is available
    if (user && user.id) {
      fetchData();
    }
  }, [user]); // Dependency array, re-fetch data when `user` changes

  return (
    <div className="explorerContainer">
      {items.length === 0 && <LoadingSpinner />}
      {items.map((one) => (
        <ImageCard
          userId={user.id} // Use user.id directly
          key={one.imageName}
          imageName={one.imageName}
          prompt={one.prompt}
          imageUrl={`data:image/png;base64,${one.imageData}`}
        />
      ))}
    </div>
  );
}

export default Explore;

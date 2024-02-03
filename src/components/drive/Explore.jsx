import { useEffect, useContext, useState } from 'react';
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import ImageCard from '../drive/ImageCard';
 
function Explore() {
    const { user } = useContext(UserContext);
    const [items, setItems] = useState([]);
 
    useEffect(() => {
        const fetchData = async () => { 
            try {
                // Use user.id directly in your request
                const images = await axios.post(`http://localhost:5069/drive/user/images`, { id: user.id });
                setItems(images.data.data);
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
        <div>
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
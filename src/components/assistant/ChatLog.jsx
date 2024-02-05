import React, { useContext } from 'react';
import { UserDataContext } from "../../context/UserDataContext";
import LoadingSpinner from "../layout/loadingSpinne/LoadingSpinner.jsx"

function ChatLog() {

    const { chatLog, images } = useContext(UserDataContext);
  
    const imageRefs = images.map(image => ({
        _id: image._id, // Only include the _id and createdAt fields
        createdAt: image.createdAt,
        type: 'imageRef', // Marker to indicate this entry is an image reference
    }));
    const combinedArray = [...chatLog, ...imageRefs];
    const sortedCombinedArray = combinedArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return (
        <>
            <div className={sortedCombinedArray.length ? "chatLog" : "chatLog loading"} id="chatLog">
            {sortedCombinedArray.length ? sortedCombinedArray.map((item) => {
                if (item.type === 'imageRef') {
                // For image references, just display the _id
                return <div className="assistantMessage linkedImage" key={item._id}><a href={`drive/#${item._id}`}>Generated Image</a></div>;
                } else {
                // For chat messages, display as before
                let roleClass = item.role === "user" ? "userMessage" : "assistantMessage";
                return (
                    <div key={item._id} className={roleClass}>
                    <p className="chatLog-messages">
                        <span className="chatRole">{item.role}: </span>
                        <br></br>
                        {item.message}
                    </p>
                    </div>
                );
                }
            }) : <LoadingSpinner className="loadingSpinner" />}
            </div>
        </>
    );
}

export default ChatLog;
import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

import { UserContext } from "../context/UserContext";
const API_URL = import.meta.env.VITE_APP_SERVER;
const UserDataContext = createContext();

const UserDataContextWrapper = ({ children }) => {
  const { user } = useContext(UserContext);
  const [entries, setEntries] = useState([]);
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      const fetchEntriesAndImages = async () => {
        try {
          const entriesResponse = await axios.post(`${API_URL}/drive/user/entry`, { id: user.id });
          setEntries(entriesResponse.data.data);
          const fetchedEntries = entriesResponse.data.data;
          setNotes(fetchedEntries.filter(entry => entry.entryKind === 'note'));
          setDiaries(fetchedEntries.filter(entry => entry.entryKind === 'diary'));
          setCalendars(fetchedEntries.filter(entry => entry.entryKind === 'calendar'));
          const imagesResponse = await axios.post(`${API_URL}/drive/user/images`, { id: user.id });
          setImages(imagesResponse.data.data);
          console.log("User data loaded");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchEntriesAndImages();
    }
  }, [user]); 
console.log(diaries)
  return (
    <UserDataContext.Provider value={{ entries,notes,diaries,calendars, images }}>
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataContextWrapper };

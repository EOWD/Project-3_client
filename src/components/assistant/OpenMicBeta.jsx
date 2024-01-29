import { useState, useEffect , useContext} from "react";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import annyang from "annyang";
import { Route } from "react-router-dom";
import {UserContext} from "../../context/UserContext";
function AudioRecorder() {
  const {user}=useContext(UserContext);

  const id =user.id
  const REACT_APP_SERVER = 'http://localhost:5500'
    const navigate= useNavigate()
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);

      // Stop recording after 30 seconds
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setRecording(false);
        }
      }, 10000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  useEffect(() => {
    if (annyang) {
      // Define the commands
      const commands = {
        "v":startRecording,
        "home" : () => navigate('/'),
        "profile" : () => navigate('/profile'),
      
      }; 

      // Add our commands to annyang
      annyang.addCommands(commands);

      // Start listening
      annyang.start();
    } else {
      console.error("Speech Recognition is not supported");
    }

    // Cleanup function to abort annyang when the component unmounts
    return () => {
      if (annyang) {
        annyang.abort();
      }
    };
  }, []);

  useEffect(() => {
    const sendAudio = async () => {
      if (audioBlob) {
        const formData = new FormData();
        formData.append('id',id)
        formData.append("myFile", audioBlob, "recording.mp3");
        try {
          const response = await axios.post(
           
            `${REACT_APP_SERVER}/drive/assistant`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setSendStatus("Sent successfully");
          console.log(response.data);
        } catch (error) {
          setSendStatus("Error sending audio");
          console.error("Error uploading file:", error);
        }
      }
    };

    sendAudio();
  }, [audioBlob]);

  return (
    <div>
      {recording ? (
        <p>Recording...</p>
      ) : (
        <p>Not Recording. Say home to start.</p>
      )}
      {sendStatus && <p>{sendStatus}</p>}
    </div>
  );
}

export default AudioRecorder;

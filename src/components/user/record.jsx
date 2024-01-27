import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
function AudioRecorder() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const { user } = useContext(UserContext);
  const [stream, setStream] = useState("stream");


  const id = user.id;
  // Function to start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 10000); // Stops recording after 3 seconds
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // useEffect to send the audio once recording is stopped
  useEffect(() => {
    const sendAudio = async () => {
      if (audioBlob) {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("myFile", audioBlob, "recording.mp3");
        console.log(audioBlob);
        try {
          const response = await axios.post(
            "http://localhost:5500/drive/assistant",
            formData
          );
          setSendStatus("Sent successfully");
          console.log(response.data)
          const inStream = response.data.Stream;
          console.log(inStream);
          const audioUrl = `data:audio/mpeg;base64,${inStream}`;
          setStream(audioUrl);
         // console.log(response.data);
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
     <div>
      {stream && <audio src={stream} autoPlay  />}
      {sendStatus && <p>{sendStatus}</p>}
    </div>
      <button onClick={startRecording} disabled={recording}>
        {recording ? "Recording..." : "Start Recording"}
      </button>
      {sendStatus && <p>{sendStatus}</p>}
    </div>
  );
}

export default AudioRecorder;

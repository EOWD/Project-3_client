import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import ImageCard from '../drive/ImageCard.jsx'
import { Mic, Trash2 } from 'lucide-react';
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

function AudioRecorder() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [recording, setRecording] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [prompt,setPrompt] = useState(null);
  const { user } = useContext(UserContext);
  //const[image,setImage]=useState(null);
  const [imageUrl,setUrl] = useState(null);
  const server=import.meta.env.VITE_APP_SERVER
  const id = user.id;

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  const [count, setCount] = useState(10);
  const countdownTimerIdRef = useRef();
  const recordingTimeoutIdRef = useRef();
  const recorderControls = useVoiceVisualizer();
  const { audioRef } = recorderControls;
  const stopManuallyRef = useRef(false);

  /* Countdown for besides the button */
  const startCountdown = () => {
    if (countdownTimerIdRef.current) clearInterval(countdownTimerIdRef.current);

    setCount(10);

    countdownTimerIdRef.current = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownTimerIdRef.current);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  // Function to start recording
  const startRecording = async () => {
    try {
      startCountdown()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        console.log("stopManually in the onstop:",stopManuallyRef.current)
        if (!stopManuallyRef.current) { // Check if the stop was not manual
          const audioBlob = new Blob(audioChunks);
          setAudioBlob(audioBlob);
        }
        stream.getTracks().forEach((track) => track.stop());
        // Reset the manual stop flag for the next recording
        stopManuallyRef.current = false;
      };

      mediaRecorder.start();
      setRecording(true);

      recordingTimeoutIdRef.current = setTimeout(() => {
        console.log("Calling stop after 10sec SUCCESS")
        stopRecording();
      }, 10000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    clearTimeout(recordingTimeoutIdRef.current);
    clearTimeout(countdownTimerIdRef.current);
    console.log("stopRecording() called")
  };

  const stopRecordingManually = () => {
    stopManuallyRef.current = true;
    stopRecording()
    console.log("stopRecordingManually() MANUAL")
  }

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
            `http://localhost:5069/call/assistant `,
            formData
          );
          setSendStatus("Sent successfully");
          console.log(response.data)
          if( response.data.image){
            const image = response.data.image.imageData
            setUrl(`data:image/png;base64,${image}`);
            setImageName(response.data.image.name)
            setPrompt(response.data.image.prompt)
          }
          const inStream = response.data.Stream;
         // console.log(inStream);
          const audioUrl = `data:audio/mpeg;base64,${inStream}`;
          mediaRecorderRef.current = audioUrl;
         // console.log(response.data);
         clearTimeout(recordingTimeoutIdRef.current);
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
    
     <ImageCard userId="123" imageName={imageName} prompt={prompt} imageUrl={imageUrl} />


     {imageUrl &&  <img  src={imageUrl} alt="" width={'500px'} />}
      {mediaRecorderRef.current && <audio src={mediaRecorderRef.current} autoPlay  />}
      {sendStatus && <p>{sendStatus}</p>}
      
    </div>
      <div className={recording ? "voiceAssistant-buttonWrapper isRecording" : "voiceAssistant-buttonWrapper"}>
        <p className="recordingCountdown">{count}s</p>
        <button className="voiceAssistant-button" onClick={startRecording} disabled={recording}>
          {recording ? <Mic size="32" className="recording" />:<Mic size="32" />}
        </button>
        <div className="deleteRecording" onClick={stopRecordingManually}>
          <Trash2 size="22" />
        </div>
      </div>
      <VoiceVisualizer ref={audioRef} controls={recorderControls} />
      {sendStatus && <p>{sendStatus}</p>}
    </div>
  );
}

export default AudioRecorder;

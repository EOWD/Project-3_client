import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { UserDataContext } from "../../context/UserDataContext.jsx";
import ImageCard from "../drive/ImageCard.jsx";
import { Mic, Trash2, SendHorizontal, GalleryVerticalEnd } from "lucide-react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { useLocation } from 'react-router-dom';


import Circle from './audioVisualization/audioVisualizer'

import AudioVisualizer from "./audioVisualization/audioVisualizer.jsx";
import LoadingSpinner from "../layout/loadingSpinne/LoadingSpinner.jsx"
import ChatLog from "../assistant/ChatLog.jsx"


function AudioRecorder() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [recording, setRecording] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const audioElementRef = useRef(null);
  const [prompt, setPrompt] = useState(null);
  const [stream, setStream] = useState("stream");
  //const[image,setImage]=useState(null);
  const [imageUrl, setUrl] = useState(null);
  const server = import.meta.env.VITE_APP_SERVER;
  const { chatLog, images, calendars } = useContext(UserDataContext);
  const { user } = useContext(UserContext);
  let id = user.id

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [count, setCount] = useState(10);
  const countdownTimerIdRef = useRef();
  const recordingTimeoutIdRef = useRef();
  const recorderControls = useVoiceVisualizer();
  const { audioRef } = recorderControls;
  const stopManuallyRef = useRef(false);


  const location = useLocation();
  const [idle, setIdle] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);


  useEffect(() => {
    const audioElement = audioElementRef.current;

    // Define the event handler
    const handleAudioEnd = () => {
      console.log('Audio has ended playing');
      toggleVoice('idle')
      // Perform any additional logic you need when the audio ends
    };

    // Attach the event listener to the audio element
    audioElement.addEventListener('ended', handleAudioEnd);

    // Clean up the event listener when the component unmounts
    return () => {
      audioElement.removeEventListener('ended', handleAudioEnd);
    };
  }, []);



  const toggleVoice = (state) => {
    setIdle(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setIsListening(false);

    if (state === 'listening') {
      setIsListening(true);
    } else if (state === 'speaking') {
      setIsSpeaking(true);
    } else if (state === 'thinking') {
      setIsThinking(true);
    } else if (state === 'idle') {
      setIdle(true)
    }
  };

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
      startCountdown();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        if (!stopManuallyRef.current) {
          // Check if the stop was not manual
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
        stopRecording();
      }, 300000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      clearTimeout(recordingTimeoutIdRef.current);
      clearTimeout(countdownTimerIdRef.current);
    }
  };

  const stopRecordingManually = () => {
    stopManuallyRef.current = true;
    stopRecording();
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
            `${server}/call/assistant`,
            formData
          );
          setSendStatus("Sent successfully");
          toggleVoice('thinking')
          console.log(response.data);
          if (response.data.image) {
            const image = response.data.image.imageData;
            setUrl(`data:image/png;base64,${image}`);
            setImageName(response.data.image.name);

            setPrompt(response.data.image.prompt);
          }

          const inStream = response.data.Stream;
          setAudioUrl(`data:audio/mpeg;base64,${inStream}`);
          // console.log(inStream);


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

  useEffect(() => {
    if (audioUrl && audioElementRef.current) {
      audioElementRef.current.src = audioUrl;
      audioElementRef.current
        .play()
        .catch((error) => console.error("Playback was prevented:", error));
    }
    toggleVoice('speaking')
  }, [audioUrl]);

  function toggleChatLog() {
    var chatLogWindow = document.getElementById('chatLog');

    if (chatLogWindow.style.display === 'flex') {
      chatLogWindow.style.display = 'none';
    } else {
      chatLogWindow.style.display = 'flex';

      // Ensure the changes are reflected in the DOM
      setTimeout(() => {
        var latestMessage = document.getElementById('latest');
        if (latestMessage) {
          latestMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 0); // A timeout of 0 ms is often enough to wait for the next repaint
    }
  }

  function closeGeneratedImagePopup() {

  }


  return (
    <div>

      {location.pathname === '/' && <Circle
        idle={idle}
        isSpeaking={isSpeaking}
        isThinking={isThinking}
        isListening={isListening}
        onToggleState={toggleVoice}
      />}

      <div className="generatedImage-component hidden">
        <p className="closePopup">Close</p>
        {imageName && (
          <ImageCard
            userId="123"
            imageName={imageName}
            prompt={prompt}
            imageUrl={imageUrl}
          />
        )}
        <audio ref={audioElementRef} controls style={{ display: "none" }}>
          Your browser does not support the audio element.
        </audio>
        {/* {imageUrl &&  <img  src={imageUrl} alt="" width={'500px'} />}
      {mediaRecorderRef.current && <audio src={mediaRecorderRef.current} autoPlay  />}
      {sendStatus && <p>{sendStatus}</p>} */}

      </div>

      <ChatLog />

      <div className={recording ? "voiceAssistant-buttonWrapper isRecording" : "voiceAssistant-buttonWrapper"}>
        <div className="chatLogToggle" onClick={toggleChatLog}>
          <GalleryVerticalEnd size="25" />
        </div>
        <p className="recordingCountdown">{count}s</p>
        <button
          className="voiceAssistant-button"
          onClick={() => { startRecording(); toggleVoice('listening') }}
          disabled={recording}
        >
          {recording ? (
            <Mic size="32" className="recording" />
          ) : (
            <Mic size="32" />
          )}
        </button>
        <div className="deleteRecording" onClick={stopRecordingManually}>
          <Trash2 size="22" />
        </div>
        <div className="sendRecording" onClick={() => { stopRecording(); toggleVoice('thinking') }}>
          <SendHorizontal size="25" />
        </div>
      </div>
      {/* <VoiceVisualizer ref={audioRef} controls={recorderControls} />
      {sendStatus && <p>{sendStatus}</p>} */}
    </div>
  );
}

export default AudioRecorder;

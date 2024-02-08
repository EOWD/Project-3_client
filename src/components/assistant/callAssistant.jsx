import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { UserDataContext } from "../../context/UserDataContext.jsx";
import ImageCard from "../drive/ImageCard.jsx";
import { Mic, Trash2, SendHorizontal, GalleryVerticalEnd, StopCircle } from "lucide-react";
import { useLocation } from 'react-router-dom';


import Circle from './audioVisualization/audioVisualizer'
import ChatLog from "../assistant/ChatLog.jsx"


function AudioRecorder() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [recording, setRecording] = useState(false);
  const recordingRef = useRef(recording);
  const [sendStatus, setSendStatus] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const audioElementRef = useRef(null);
  const [prompt, setPrompt] = useState(null);
  const [stream, setStream] = useState("stream");
  //const[image,setImage]=useState(null);
  const [imageUrl, setUrl] = useState(null);
  const [imageVisible, setImageVisible] = useState(false)
  const server = import.meta.env.VITE_APP_SERVER;
  const { chatLog, images, calendars } = useContext(UserDataContext);
  const { user } = useContext(UserContext);
  let id = user.id

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [count, setCount] = useState(0);
  const countdownTimerIdRef = useRef();
  const recordingTimeoutIdRef = useRef();
  const stopManuallyRef = useRef(false);


  const location = useLocation();
  const [idle, setIdle] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

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

  /* Countdown for on top the button */
  const startCounting = () => {
    if (countdownTimerIdRef.current) clearInterval(countdownTimerIdRef.current);
    setCount(0);

    countdownTimerIdRef.current = setInterval(() => {
      setCount((prevCount) => {
        if (recordingRef.current) { // Use recordingRef here
          return prevCount + 1;
        }
        clearInterval(countdownTimerIdRef.current);
        return prevCount;
      });
    }, 1000);
  };
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    } else {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
    }
  };

  // Function to start recording

  const startRecording = async () => {
    try {
      
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
      startCounting();

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
      startCounting(); /* stops the count up */
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
          toggleVoice('thinking')
          console.log(response.data);
          if (response.data.image) {
            const image = response.data.image.imageData;
            setUrl(`data:image/png;base64,${image}`);
            setImageName(response.data.image.name);

            setPrompt(response.data.image.prompt);
            setImageVisible(true)
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
          setIsThinking(false);
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
      toggleVoice('speaking')
    }
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

  function stopAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.pause(); // Pause the audio
    setIdle(false);
    setIsSpeaking(false);
    if (audioPlayer.duration) {
      audioPlayer.currentTime = audioPlayer.duration; // Set to the end of the audio
    }
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
      <div className={imageVisible ? "generatedImage-component" : "generatedImage-component hidden"}>
        {imageName && (
          <ImageCard
            userId="123"
            imageName={imageName}
            prompt={prompt}
            imageUrl={imageUrl}
            imageVisible={imageVisible}
            setImageVisible={setImageVisible}
          />
        )}
        <audio id="audioPlayer" ref={audioElementRef}>
          Your browser does not support the audio element.
        </audio>
      </div>

      <ChatLog />

      <div className={recording ? "secondsDeleteStop-buttonsContainer isRecording" : "secondsDeleteStop-buttonsContainer"}>
        {sendStatus && (<p className="sendStatus-error">{sendStatus}</p>)} {/* SHOWING A ERROR WHEN SENDING FAILED */}
        <div className="deleteRecording" onClick={stopRecordingManually}>
            <Trash2 size="22" />
        </div>
        <p className="recordingCountdown">{formatTime(count)}</p>
        <button className={isSpeaking ? "stopAudioPlay isSpeaking" : "stopAudioPlay"} onClick={() => stopAudio()}><StopCircle size="32" /></button>
      </div>
      <div className={recording ? "voiceAssistant-buttonWrapper isRecording" : isThinking ? "voiceAssistant-buttonWrapper isThinking" : isSpeaking ? "voiceAssistant-buttonWrapper isSpeaking" : "voiceAssistant-buttonWrapper"}>
        <div className="chatLogToggle" onClick={toggleChatLog}>
          <GalleryVerticalEnd size="25" />
        </div>
        
        <button
          className="voiceAssistant-button"
          onClick={() => { startRecording(); toggleVoice('listening'); setSendStatus(null); }}
          disabled={recording || isThinking || isSpeaking}
        >
          {recording ? (
            <Mic size="32" className="recording" />
          ) : (
            <Mic size="32" />
          )}
        </button>
        
        <div className={recording ? "sendRecording" : "sendRecording disabled"} onClick={() => { stopRecording(); toggleVoice('thinking') }}>
          <SendHorizontal size="25" />
        </div>
        
      </div>
    </div>
  );
}

export default AudioRecorder;

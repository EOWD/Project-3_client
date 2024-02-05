import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { UserDataContext } from "../../context/UserDataContext.jsx";
import ImageCard from "../drive/ImageCard.jsx";
import { Mic, Trash2, SendHorizontal, GalleryVerticalEnd } from "lucide-react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
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
      }, 10000);
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
  }, [audioUrl]);

  function toggleChatLog() {
    var chatLogWindow = document.getElementById('chatLog');

    if (chatLogWindow.style.display === 'flex') {
      chatLogWindow.style.display = 'none';
    } else {
      chatLogWindow.style.display = 'flex';
    }
  }

  return (
    <div>
      <div className="generatedImage-component">
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
          onClick={startRecording}
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
        <div className="sendRecording" onClick={stopRecording}>
          <SendHorizontal size="25" />
        </div>
      </div>
      {/* <VoiceVisualizer ref={audioRef} controls={recorderControls} />
      {sendStatus && <p>{sendStatus}</p>} */}
    </div>
  );
}

export default AudioRecorder;

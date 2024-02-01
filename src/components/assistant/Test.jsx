import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {UserContext} from "../../context/UserContext";

function AudioRecorder() {
  const { user } = useContext(UserContext);
  const id = user.id;
  const REACT_APP_SERVER = 'http://localhost:5500';
  const navigate = useNavigate();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Initialize media devices
    async function initMediaDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newMediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(newMediaRecorder);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }
    initMediaDevices();
  }, []);

  const handleDataAvailable = (event) => {
    setAudioChunks((prev) => [...prev, event.data]);
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
    const formData = new FormData();
    formData.append('id', id);
    formData.append('myFile', audioBlob, 'recording.mp3');

    try {
      const response = await axios.post(`${REACT_APP_SERVER}/call/assistant`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const startRecording = () => {
    if (mediaRecorder) {
      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Setup silence detection to stop recording
  useEffect(() => {
    let silenceTimer;
    if (isRecording) {
      const checkSilence = () => {
        silenceTimer = setTimeout(() => {
          stopRecording();
        }, 5000); // 5 seconds of silence
      };

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(mediaRecorder.stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const data = array.reduce((a, b) => a + b) / array.length;

        if (data < 10) {
          // Silence detected
          clearTimeout(silenceTimer);
          checkSilence();
        } else {
          // Sound detected
          clearTimeout(silenceTimer);
        }
      };
    }

    return () => clearTimeout(silenceTimer);
  }, [isRecording, mediaRecorder]);

  return (
    <div>
      {!isRecording && <button onClick={startRecording}>Start Recording</button>}
      {isRecording && <p>Recording... Speak now.</p>}
    </div>
  );
}

export default AudioRecorder;

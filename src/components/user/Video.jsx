import { useEffect, useRef, useState } from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";

import io from "socket.io-client";

function VideoChatApp() {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const socket = io.connect("http://localhost:5005/");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
        console.log(stream);
      });

    socket.on("me", (id) => {
      console.log("My socket ID:", id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = async (id) => {
    try {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      await stream.getTracks().forEach((track) => peer.addTrack(track, stream));

       peer.ontrack = (event) => {
        console.log("Received remote stream", event.streams[0]);
        if (userVideo.current) {
          userVideo.current.srcObject = event.streams[0];
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("sendCandidate", { candidate: event.candidate, to: id });
        }
      };

      peer
        .createOffer()
        .then((offer) => {
          return peer.setLocalDescription(offer);
        })
        .then(() => {
          socket.emit("callUser", {
            userToCall: id,
            signalData: peer.localDescription,
            from: socket.id,
            name: name,
          });
        });

      socket.on("callAccepted", (signal) => {
        setCallAccepted(true);
        const remoteDesc = new RTCSessionDescription(signal);
        peer.setRemoteDescription(remoteDesc).catch((e) => console.error(e));
      });
      connectionRef.current = peer;
    } catch (err) {
      console.log(err);
    }
  };

  const answerCall = () => {
    try{
        setCallAccepted(true);

const peer = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

stream.getTracks().forEach((track) => peer.addTrack(track, stream));
peer.ontrack = (event) => {
  if (userVideo.current) {
    userVideo.current.srcObject = event.streams[0];
    console.log(userVideo.current.srcObject);
  } else {
    console.error("userVideo ref is not defined");
  }
};

peer.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit("sendCandidate", {
      candidate: event.candidate,
      to: caller,
    });
  }
};

peer
  .setRemoteDescription(new RTCSessionDescription(callerSignal))
  .then(() => {
    return peer.createAnswer();
  })
  .then((answer) => {
    return peer.setLocalDescription(answer);
  })
  .then(() => {
    socket.emit("answerCall", {
      signal: peer.localDescription,
      to: caller,
    });
  });

connectionRef.current = peer;
    }catch(err){console.log(err)}
   
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.close();
    window.location.reload();
  };

  return (
<>
			<h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1>
		<div className="container">
			<div className="video-container">
				<div className="video">
					{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
				</div>
				<div className="video">
					{callAccepted && !callEnded ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					null}
				</div>
			</div>
			<div className="myId">
				<TextField
					id="filled-basic"
					label="Name"
					variant="filled"
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ marginBottom: "20px" }}
				/>
				
			

				<TextField
					id="filled-basic"
					label="ID to call"
					variant="filled"
					value={idToCall}
					onChange={(e) => setIdToCall(e.target.value)}
				/>
				<div className="call-button">
					{callAccepted && !callEnded ? (
						<Button variant="contained" color="secondary" onClick={leaveCall}>
							End Call
						</Button>
					) : (
						<IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
							<PhoneIcon fontSize="large" />
						</IconButton>
            )}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default VideoChatApp;

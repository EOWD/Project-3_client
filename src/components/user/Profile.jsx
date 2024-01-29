import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import FileUpload from "../drive/STT.form"
import StartRecording from '../assistant/callAssistant'
import AudioRecorder from '../assistant/OpenMicBeta'
import CreateAssistantForm from '../assistant/createAssistant'

export default function Profile() {
  const { user, handleLogout } = useContext(UserContext);
  console.log(user);
  return (
    <div>
      <p>Welcome!</p>
      <h1>{user && user.username}'s Profile</h1>
   
      <FileUpload/>
     <StartRecording/>

      <br/>
     
      <button onClick={handleLogout}>Logout</button>
    
      <CreateAssistantForm/>
    </div>
  );
}
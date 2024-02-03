import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

import Call from "../assistant/callAssistant";
import AudioRecorder from "../assistant/OpenMicBeta";
import CreateAssistantForm from "../assistant/createAssistant";
import AudioRecorders from "../assistant/Test";
import FileUpload from "../drive/DriveFileUpload";
export default function Profile() {
  console.log(import.meta.env.VITE_APP_SERVER);
  const { user, handleLogout } = useContext(UserContext);
  console.log(user);
  return (
    <div>
      <p>Welcome!</p>
      <h1>{user && user.username}'s Profile</h1>



      <Call />

      <br />

      <button onClick={handleLogout}>Logout</button>

      <CreateAssistantForm />

      <FileUpload/>
    </div>
  );
}

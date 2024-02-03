import { useContext } from "react";
import Call from '../components/assistant/callAssistant'
import "./voice.css"

export default function Voice() {
  return (
    <div className="callAssistant">
      <h1>VoiceAI</h1>
      <Call/>
    </div>
  );
}
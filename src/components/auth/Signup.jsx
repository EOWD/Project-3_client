import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css"

const API_URL = "http://localhost:5069";


function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleUsername = (event) => setUsername(event.target.value);
  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  const handlePhoneNumber = (event) => setPhoneNumber(event.target.value);
  const handleSignup = (event) => {
    event.preventDefault();

    const requestBody = { username, email, password, phoneNumber };
    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then((response) => {
        console.log(response.data);
        navigate("/login");
      })

      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.errorMessage);
      });
  };

  return (
    <div className="login-container">
  
      <div className="login-leftContainer">
        <div className="login-leftImage"></div>
        <div className="blur"></div>
      </div>
      <div className="login-rightForm">
      <h2>Create a Account</h2>
      <div className="signupCta">
          <p>Already have an account?</p>
          <Link to={`/login`}>Log in</Link>
      </div>
      <form className="loginForm" onSubmit={handleSignup}>
        <input
          required
          id="username"
          type="text"
          name="username"
          value={username}
          onChange={handleUsername}
          placeholder="Username"
        />
        <input
          required
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
          placeholder="E-Mail"
        />
        <input
          required
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
          placeholder="Password"
        />
        <input
          required
          id="phoneNumber"
          type="number"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumber}
          placeholder="Phone Number"
        />
        <button className="loginButton" type="submit">
            <span className="loginButton-text">Start Creating</span>
            <span className="loginButton-arrow">🡢</span>
          </button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      </div>
    </div>
  );
}
export default Signup;
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import "./login.css"

const API_URL = "http://localhost:5069";

function Login() {
  const navigate = useNavigate();
  const { authenticateUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  const handleLogin = (event) => {
    event.preventDefault();

    const requestBody = { email, password };
    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then(({ data }) => {
        console.log("response from login", data);
        localStorage.setItem("authToken", data.token);
        return authenticateUser().then(() => {
          navigate("/profile");
        });
      })
      .catch((error) => {
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
        <h2>Sign in to<br></br> your Account</h2>
        <div className="signupCta">
          <p>You don't have an account yet?</p>
          <Link to={`/signup`}>Sign up</Link>
        </div>
        <form className="loginForm" onSubmit={handleLogin}>
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
          <button className="loginButton" type="submit">
            <span className="loginButton-text">Login</span>
            <span className="loginButton-arrow">🡢</span>
          </button>
        </form>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}
export default Login;

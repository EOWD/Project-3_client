import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5500";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
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
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <label htmlFor="username">Username:</label>
        <input
          required
          id="username"
          type="text"
          name="username"
          value={username}
          onChange={handleUsername}
        />
        <br></br>
        <br></br>

        <label htmlFor="email">Email:</label>
        <input
          required
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
        />
        <br></br>
        <br></br>

        <label htmlFor="password">Password:</label>
        <input
          required
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
        <br></br>
        <br></br>

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          required
          id="phoneNumber"
          type="number"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumber}
        />
        <br></br>
        <br></br>

        <button type="submit">Create an Account</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <p>If you have already an account, click "Login Page"</p>
      <Link to={"/login"}>Login Page</Link>
    </div>
  );
}
export default Signup;
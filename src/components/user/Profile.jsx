import { useContext, useState,useEffect } from "react";
import axios from 'axios'
import { UserContext } from "../../context/UserContext";
import { Form, ButtonToolbar, Button, Input } from "rsuite";
import Chart from "../charts";
export default function Profile() {
  // Access the user context
  const { user, setUser } = useContext(UserContext);

  // State management for form fields
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  // Function to handle form submission
  const handleSubmit = async () => {
    const updateData = {
      id: user.id, // Assuming your user context includes the user's id
      username,
      email,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVER}/auth/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }

      const updatedUser = await response.json();
      // Assuming your backend returns the updated user object, update context
      setUser(updatedUser);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div style={{display:'flex', alignItems:'center',justifyContent:"center"}}>
      {" "}
      <div style={{ maxWidth: "450px", margin: "100px auto" }}>
        <h3>Update Your Profile</h3>
     
        <div style={{ maxWidth: "350px", margin: "50px 0" }}>
          <Form fluid>
            <Form.Group controlId="username">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Input value={username} onChange={setUsername} name="username" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Input
                value={email}
                onChange={setEmail}
                name="email"
                type="email"
              />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </div>
      </div>{" "}
      <div>
        <Chart></Chart>
      </div>
    </div>
  );
}

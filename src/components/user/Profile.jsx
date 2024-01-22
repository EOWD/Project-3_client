import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";


export default function Profile() {
  const { user, handleLogout } = useContext(UserContext);
  console.log(user);
  return (
    <div>
      <p>Welcome!</p>
      <h1>{user && user.username}'s Profile</h1>
      <Link to="/createTodo">Create To-Do</Link>
      
      <button onClick={handleLogout}>Logout</button>
     
      
    </div>
  );
}
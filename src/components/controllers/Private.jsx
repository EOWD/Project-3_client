import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Navigate } from "react-router-dom";

function IsPrivate({ children }) {
  const { isLoading, isLoggedIn } = useContext(UserContext);

  if (isLoading) {
    return <p>Imagine a cool loading spinner...</p>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}
export default IsPrivate;
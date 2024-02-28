import { Navigate } from "react-router-dom";

export const PrivateResource = ({ component }) => {
const accessToken = localStorage.getItem("token");
  if (!accessToken) {
    return <Navigate to="/login" />;
  }
  return component;
};

export default PrivateResource;
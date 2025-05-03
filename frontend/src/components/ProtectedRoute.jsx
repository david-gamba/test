// if we wrap something in this route, then we need to have an authorisation token to access that root
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
  // 1. As soon as we load our protected view
      auth().catch(() => setIsAuthorized(false))
  }, [])

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    // 1. We get refersh token
    try {
      const res = await api.post("/api/token/refresh/", { // won't work without / at the end
        refresh: refreshToken,
        // 2. We send it to the backend - based on our imported api.js (and base url there and we just pass endpoint/route)
      });
      if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access)
          setIsAuthorized(true)
        // 3. If response is OK, we change access token to access token
      }  else {
          setIsAuthorized(false)
        // 3. Otherwise there is error and we did not get new access token
      }
      } catch (error) {
          console.log(error);
          setIsAuthorized(false);
      }
};

  const auth = async () => {
    // no token - you are not authorized
    const token = localStorage.getItem(ACCESS_TOKEN);
    // this is from useEffect
    // 1. As soon as we load our protected view
    if (!token) {
        setIsAuthorized(false);
        return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000; // date in seconds

    if (tokenExpiration < now) {  // = it is already expired
      // 2. If we have a token and it is expired, we need to refresh token
      // 3. As soon as it is refresh, we wil access that routem
        await refreshToken();
    } else {
        setIsAuthorized(true); // if token is not yet expired, it means it is valid
      // If we have a token and it is not expired, we can simply set authorized
    }
  }

  if (isAuthorized === null) {
      return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />; // component from react DOM
  // if it is not authorized, we gonna return the navigate component back to login
}


export default ProtectedRoute;
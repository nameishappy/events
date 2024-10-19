import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState({ user: null, loading: true });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({ user, loading: false });
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (authState.loading) {
    // You can replace this with a loading spinner or any other loading indicator
    return <div>Loading...</div>;
  }

  return authState.user ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;

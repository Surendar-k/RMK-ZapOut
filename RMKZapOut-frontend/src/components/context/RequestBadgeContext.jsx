import { createContext, useContext, useEffect, useState } from "react";
import socket from "../context/socket.js";

const RequestBadgeContext = createContext(null);

export const RequestBadgeProvider = ({ children }) => {
  const [newRequestCount, setNewRequestCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const staffId = user?.id;

  useEffect(() => {
    if (!staffId) return;

    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", staffId);

    const handleNewRequest = () => {
      console.log("New request received!"); // debug
      setNewRequestCount((prev) => prev + 1);
    };

    socket.on("newRequest", handleNewRequest);

    return () => {
      socket.off("newRequest", handleNewRequest);
    };
  }, [staffId]);

  const clearRequestBadge = () => {
    setNewRequestCount(0);
  };

  return (
    <RequestBadgeContext.Provider
      value={{ newRequestCount, clearRequestBadge }}
    >
      {children}
    </RequestBadgeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRequestBadge = () => {
  const ctx = useContext(RequestBadgeContext);
  if (!ctx) throw new Error("useRequestBadge must be used inside RequestBadgeProvider");
  return ctx;
};

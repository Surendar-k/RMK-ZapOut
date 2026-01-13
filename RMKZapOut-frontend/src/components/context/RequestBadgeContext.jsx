import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const RequestBadgeContext = createContext(null);

export const RequestBadgeProvider = ({ children }) => {
  const [newRequestCount, setNewRequestCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const staffId = user?.id;

  useEffect(() => {
    if (!staffId) return;

    const socket = io("http://localhost:5000");

    socket.emit("joinRoom", staffId);

    /* ✅ ONLY for new requests */
    socket.on("newRequest", () => {
      setNewRequestCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
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
  if (!ctx) {
    throw new Error("useRequestBadge must be used inside RequestBadgeProvider");
  }
  return ctx;
};

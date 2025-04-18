import React, { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

// Replace with your actual User type

interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within an SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useMemo(
    () => io(import.meta.env.VITE_REACT_APP_BASE_URL as string),
    []
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

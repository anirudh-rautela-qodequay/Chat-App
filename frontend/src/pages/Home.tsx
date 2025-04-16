import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ChatWindow from "./ChatWindow";
import LandingPage from "./LandingPage";

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  console.log("currentUser", currentUser);

  if (!currentUser) return <LandingPage />;
  return <ChatWindow />;
};

export default Home;

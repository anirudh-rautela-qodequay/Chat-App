import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define types for the state
type Theme = "light" | "dark";

interface StateContextType {
  theme: Theme;
  updateTheme: (newState: Theme) => void;
}

// Create Context
const StateContext = createContext<StateContextType | undefined>(undefined);

// Provider Component
export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getInitialState = (): Theme => {
    const storedState = localStorage.getItem("appTheme");
    return storedState ? JSON.parse(storedState) : "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitialState);

  useEffect(() => {
    localStorage.setItem("appTheme", JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (newState: Theme) => {
    setTheme(newState);
  };

  return (
    <StateContext.Provider value={{ theme, updateTheme }}>
      {children}
    </StateContext.Provider>
  );
};

// Custom hook for easy access
export const useAppTheme = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
};

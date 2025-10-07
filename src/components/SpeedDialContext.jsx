import React, { createContext, useContext, useState } from "react";

const SpeedDialContext = createContext();

export const useSpeedDial = () => {
  const context = useContext(SpeedDialContext);
  if (!context) {
    throw new Error("useSpeedDial must be used within a SpeedDialProvider");
  }
  return context;
};

export const SpeedDialProvider = ({ children }) => {
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  return (
    <SpeedDialContext.Provider value={{ isSpeedDialOpen, setIsSpeedDialOpen }}>
      {children}
    </SpeedDialContext.Provider>
  );
};

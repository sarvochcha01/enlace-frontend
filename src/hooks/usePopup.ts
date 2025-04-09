import { useContext } from "react";
import { PopupContext, PopupContextType } from "../context/PopupContext";

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

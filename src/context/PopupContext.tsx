import React, { createContext, useState } from "react";

export interface PopupContextType {
  setPopupContent: (newContent: React.ReactNode) => void;
  setIsPopupVisible: (isVisible: boolean) => void;
}

export const PopupContext = createContext<PopupContextType | null>(null);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [content, setContent] = React.useState<React.ReactNode>(null);

  const setPopupContent = (newContent: React.ReactNode) => {
    setContent(newContent);
  };

  return (
    <PopupContext.Provider value={{ setPopupContent, setIsPopupVisible }}>
      {children}
      {isPopupVisible && content && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={() => setIsPopupVisible(false)}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {content}
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
};

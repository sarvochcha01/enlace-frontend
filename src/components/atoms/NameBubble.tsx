import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/tailwindMerge";

import { getInitials, getNameColor } from "../../utils/nameUtils";

interface NameBubbleProps {
  name: string;
  setIsSelected?: React.Dispatch<React.SetStateAction<boolean>>;
  isSelected?: boolean;
  zIndex?: number;
  onClick?: () => void;
}

const NameBubble: React.FC<NameBubbleProps> = ({
  name,
  isSelected,
  setIsSelected,
  zIndex = 1,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get consistent color for this name
  const nameColor = getNameColor(name);

  const handleClick = () => {
    setIsSelected && setIsSelected((prev) => !prev);

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="relative flex flex-col items-center z-10"
      style={{ zIndex: isHovered || isSelected ? zIndex + 1 : zIndex }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full text-white hover:cursor-pointer",
          nameColor,
          isSelected ? "border-primary border-[3px]" : "border-white border-2"
        )}
      >
        {getInitials(name)}
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={cn(
              "absolute text-xs top-12 bg-gray-700 text-white px-2 py-1 rounded whitespace-nowrap"
            )}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.15 }}
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NameBubble;

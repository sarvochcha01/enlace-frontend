import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/tailwindMerge";
import { getInitials } from "../../utils/utils";

interface NameBubbleProps {
  name: string;
  isFilter?: boolean;
  isSelected?: boolean;
  zIndex?: number;
  onClick?: () => void;
}

const NameBubble: React.FC<NameBubbleProps> = ({
  name,
  isFilter = false,
  isSelected: externalIsSelected,
  zIndex = 1,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [internalIsSelected, setInternalIsSelected] = useState(false);

  const isSelected =
    externalIsSelected !== undefined ? externalIsSelected : internalIsSelected;

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  const randomColor = useMemo(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const handleClick = () => {
    if (!isFilter) {
      return;
    }

    if (externalIsSelected === undefined) {
      setInternalIsSelected(!internalIsSelected);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className={cn(
          "w-10 h-10  flex items-center justify-center rounded-full text-white  hover:cursor-pointer",
          randomColor,
          isSelected ? "border-primary border-[3px]" : "border-white border-2",
          !isFilter && "w-6 h-6 text-xs"
        )}
      >
        {getInitials(name)}
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            style={{ zIndex: 9999 }}
            className={cn(
              "absolute text-xs top-12 bg-gray-700 text-white px-2 py-1 rounded whitespace-nowrap",
              !isFilter && "-top-6"
            )}
            initial={{ opacity: 0, y: isFilter ? -12 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isFilter ? 12 : -6 }}
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

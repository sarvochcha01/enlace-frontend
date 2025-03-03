import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/tailwindMerge";

interface NameBubbleProps {
  name: string;
  zIndex?: number;
}

const NameBubble: React.FC<NameBubbleProps> = ({ name, zIndex = 1 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

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

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ zIndex: isHovered || isSelected ? zIndex + 1 : zIndex }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsSelected(!isSelected)}
    >
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full  text-white font-bold hover:cursor-pointer",
          randomColor,
          isSelected ? "border-primary border-[3px]" : "border-white border-2"
        )}
      >
        {getInitials(name)}
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute text-xs top-12 bg-gray-700 text-white px-2 py-1 rounded whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
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
